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
  end

    def reset_db(reset)
      self.send("#{reset}_level")
    end

    def reset_level
      Rake::Task["db:reset"].invoke
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
      [Person, User, Right, Relationship, ResponderItem, ResponseSet, Response].each(&:delete_all)
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
      @surveys.each do |survey|
        system "bundle exec rake surveyor FILE=surveys/#{survey}.rb --trace"
        NormReferenceCSVParser.new(survey)
      end
    end
    
    def create_caretaker(name)
      caretaker_person = FactoryGirl.create(:person, person_attributes(rand(10)+40))
      caretaker_user = FactoryGirl.create(:user, 
                                      :email => "#{name}@snarpur.is", 
                                      :roles => [@caretaker_role], 
                                      :person => caretaker_person
                                     )
      {:person => caretaker_person, :user => caretaker_user}
    
    end

    def create_patient(caretaker_person)
      attrs = person_attributes(rand(10)+5)
      patient = FactoryGirl.create(:person, attrs)
      FactoryGirl.create(:patient_relationship, :relation => caretaker_person, :inverse_relation => patient)
      patient
    end

    def create_parent(patient)
      parent_person = FactoryGirl.create(:person, person_attributes(rand(20)+40))
      parent_user = FactoryGirl.create(:user, 
                                   :email => "user_#{parent_person.id}@snarpur.is", 
                                   :roles => [@respondent_role], 
                                   :person => parent_person
                                  )
      FactoryGirl.create(:guardian_relationship, :relation => parent_person, :inverse_relation => patient)
      FactoryGirl.create(:parent_relationship, :relation => parent_person, :inverse_relation => patient)
      {:person => parent_person, :user => parent_user}
    
  end

    def create_responder_item(survey_id ,people,created_at)

      responder_item = FactoryGirl.create( :item_with_people, 
                      :respondent => people[:parent][:person], 
                      :subject => people[:patient], 
                      :caretaker => people[:caretaker][:person],
                      :survey_id => survey_id,
                      :created_at => created_at,
                      :deadline => created_at.advance(:weeks =>2)
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
        questions.each do |question|
          answers = question.answers 
          FactoryGirl.create(:response, 
                         :response_set => item.response_set, 
                         :question_id => question.id,
                         :answer_id => answers[rand(answers.size)].id 
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

end