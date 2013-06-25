# encoding: utf-8
require 'faker'
class PopulateUtil

 	attr_accessor :surveys

 	def initialize
 		  @surveys = ["adhd_rating_scale","sdq","ysr_syndrome_scale"]
    	@caretaker_role = Role.find_by_name('caretaker')
    	@respondent_role = Role.find_by_name('respondent')
    	@sex = ['male','female']
    	@password_params = {:password => "asdfkj", :password_confirmation => "asdfkj"}
    	@survey_ids = Survey.select(:id)
      @entries = YAML::load(File.open("#{Rails.root}/lib/util/entry_values.yml")).symbolize_all_keys![:entries]
      @entry_set_ids = EntrySet.select(:id)
  end

    def reset_db(reset)
      self.send("#{reset}_level")
    end

    def reset_level
      Rake::Task["db:drop"].invoke
      Rake::Task["db:setup"].invoke
      self.generate_surveys
    end

    def user_level
      puts "clearing users"
      self.clear_user_tables
    end
  
    def survey_level
      self.generate_surveys
    end

    def clear_user_tables
      [Person, User, Right, Relationship, ResponderItem, ResponseSet, Response, EntryValue, EntrySetResponse].each(&:delete_all)
    end
    
    def random_date(years_back=5)
      year = Time.now.year - years_back
      month = rand(12) + 1
      day = rand(31) + 1
      Time.local(year, month, day)
    end

    def full_cpr(age=5)
      dob = random_date(age).strftime("%d%m%y")
      {:full_cpr => "#{dob}1289"}
    end

    def fullname
      pick = rand(2)
      sex = ['male','female'].at(pick)
      suffix = ['sson','sdóttir'].at(pick)
      lastname = "#{Faker::Name.send('male_first_name')}#{suffix}"
      lastname.gsub!(/sss/, 'ss')
      {:firstname => Faker::Name.send("#{sex}_first_name"), :lastname => lastname, :sex => sex}
    end

    def person_attributes(age)
      name = fullname()
      cpr = full_cpr(age)
      name.merge(cpr)
    end

    def generate_surveys
      [Survey, SurveySection, Question, QuestionGroup, Answer, ResponderItem, ResponseSet, Response].each(&:delete_all)
      @surveys.each do |survey|
        system "bundle exec rake surveyor FILE=surveys/#{survey}.rb --trace"
        NormReferenceCSVParser.new(survey)
      end
    end
    
    def create_caretaker(name)
      caretaker_person = FactoryGirl.create(:person, person_attributes(rand(10)+40))
      caretaker_user = FactoryGirl.create(:user, 
                                      :email => "#{name}@qodiag.com", 
                                      :roles => [@caretaker_role], 
                                      :person => caretaker_person
                                     )
      {:person => caretaker_person, :user => caretaker_user}
    
    end

    def create_patient(caretaker_person)
      attrs = person_attributes(rand(10)+5)
      patient = FactoryGirl.create(:person, attrs)
      FactoryGirl.create(:patient_relationship, :person => caretaker_person, :relation => patient)
      patient
    end

    def create_parent(patient)
      parent_person = FactoryGirl.create(:person, person_attributes(rand(20)+40))
      parent_user = FactoryGirl.create(:user, 
                                   :email => "user_#{parent_person.id}@qodiag.com", 
                                   :roles => [@respondent_role], 
                                   :person => parent_person
                                  )
      FactoryGirl.create(:guardian_relationship, :person => parent_person, :relation => patient)
      FactoryGirl.create(:parent_relationship, :person => parent_person, :relation => patient)
      {:person => parent_person, :user => parent_user}
    
  end

    def create_responder_item(survey_id ,people,created_at,entry_set_response_id=nil)
      responder_item = FactoryGirl.create( :item_with_people, 
                      :respondent_id => people[:parent][:person].id, 
                      :subject_id => people[:patient].id, 
                      :caretaker_id => people[:caretaker][:person].id,
                      :survey_id => survey_id,
                      :created_at => created_at,
                      :deadline => created_at.advance(:weeks =>2),
                      :entry_set_response_id => entry_set_response_id
                      )
      

      responder_item
    end
    
    def complete_response_set(responder_item)
    	responder_item.response_set.completed_at = responder_item.created_at.advance(:days => 1)
    	responder_item.response_set.save!
    end
    
    def complete_survey(item)
    	complete_response_set(item)
      
      survey_sections = SurveySection.where(item.survey_id).select(:id)
      survey_sections.each do |section|
        questions = Question.where("survey_section_id = #{section.id}")
        questions_size = questions.size
        questions.each_with_index do |question,index|
          answers = question.answers
          random_answer_no = index % 3 == 0 ? rand(answers.size) : rand(answers.size - 1)  
          FactoryGirl.create(:response, 
                         :response_set => item.response_set, 
                         :question_id => question.id,
                         :answer_id => answers[random_answer_no].id 
                        )
        end
      end
    end


    def create_requests(opt)
    	days = rand(100) + 700 
    	dist = days/opt[:number]
    	created_at = Time.now - rand(days).days
      opt[:number].times do |n|
      	random_pattern = (rand(0.1)/10) * ([0.9,1.0].at(rand(2)))
      	day_dist = n.odd? ? days - (dist * n) :  days - (dist * n) + random_pattern
    		created_at = Time.now - day_dist.days
    		item = create_responder_item(opt[:survey_id],opt[:people],created_at)
				complete_survey(item)
    	end
    		create_responder_item(opt[:survey_id],opt[:people],Time.zone.now - (rand(10) + 1).days) if rand(2).odd?
    		create_responder_item(opt[:survey_id],opt[:people],Time.zone.now - (rand(50) + 15).days) if rand(2).odd?
  	end

    def create_entry_set_request(people,entry_set_no,completed=true)
      entry_set_response = FactoryGirl.create(:entry_set_response,:entry_set_id =>  @entry_set_ids[entry_set_no].id, :responder_item_id => nil)
      responder_item = create_responder_item(nil,people,Time.zone.now,entry_set_response.id)
      

      if completed == true
        completed_at = responder_item.created_at.advance(:days => (rand(5)+1))
        responder_item.update_attribute("completed",completed_at)
        entry_set_response.entry_set.sections.each_with_index do |section, section_index|
          
          random_entry = rand(32)
          section.entry_fields.each_with_index do |entry_field, ef_index|
            random_index = random_entry + ef_index
            entry_value = entry_field.entry_values.create({
                                                            :text_value => @entries[random_entry + ef_index],
                                                            :person_id => people[:parent][:person].id,
                                                            :entry_set_response_id => entry_set_response.id
                                                          })
            
            random_comment = random_index > 13 ? rand(0..13) : rand(15..33)

            2.times do |t|
              entry_value.comments.create({
                :text_value =>  @entries[random_comment + t+1],
                :person_id => people[:caretaker][:person].id, 
                :entry_field_id => entry_field.id,
                :entry_set_response_id => entry_set_response.id
                })
              
            end
          end
        end
      end
    end

end