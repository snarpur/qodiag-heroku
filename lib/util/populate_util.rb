# encoding: utf-8
require 'faker'
class PopulateUtil

 	
 	def initialize
 		  @surveys = ["adhd_rating_scale","sdq"] 
    	@caretaker_role = Role.find_by_name('caretaker')
    	@client_role = Role.find_by_name('client')
    	@sex = ['male','female']
    	@password_params = {:password => "asdfkj", :password_confirmation => "asdfkj"}
    	@survey_ids = Survey.select(:id)
  end

    def reset_db(reset_method=:delete_records)
      if reset_method == :reset_db
        Rake::Task["db:reset"].invoke
      else
        [Person, User, Right, Relationship, ResponderItem, ResponseSet, Response].each(&:delete_all)
      end

    end
    
    def random_date(years_back=5)
      year = Time.now.year - years_back
      month = rand(12) + 1
      day = rand(31) + 1
      Time.local(year, month, day)
    end

    def generate_surveys
      @surveys.each do |survey|
        system "bundle exec rake surveyor FILE=surveys/#{survey}.rb --trace"
        NormReferenceCSVParser.new(survey)
      end
    end

    def fullname()
      pick = rand(2)
      sex = ['male','female'].at(pick)
      suffix = ['sson','sdóttir'].at(pick)
      lastname = Faker::Name.send("male_first_name")
      {:firstname => Faker::Name.send("#{sex}_first_name"), :lastname => "#{lastname}#{suffix}"}
    end
    
    def create_caretaker(name)
      caretaker_person = Factory.create(:person, fullname)
      caretaker_user = Factory.create(:user, 
                                      :email => "#{name}@snarpurland.is", 
                                      :roles => [@caretaker_role], 
                                      :person => caretaker_person
                                     )
      {:person => caretaker_person, :user => caretaker_user}
    
    end

    def create_patient(caretaker_person)
      patient = Factory.create(:person, fullname.merge({:dateofbirth => random_date(5)}))
      Factory.create(:patient_relationship, :person => caretaker_person, :relation => patient)
      patient
    end

    def create_parent(patient)
      parent_person = Factory.create(:person, fullname)
      parent_user = Factory.create(:user, 
                                   :email => Faker::Internet.email, 
                                   :roles => [@client_role], 
                                   :person => parent_person
                                  )
      Factory.create(:guardian_relationship, :person => parent_person, :relation => patient)
      Factory.create(:parent_relationship, :person => parent_person, :relation => patient)
      {:person => parent_person, :user => parent_user}
    
  end

    def create_responder_item(survey_id ,people,created_at)

    
      responder_item = Factory.create( :item_with_people, 
                      :client => people[:parent][:person], 
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
          Factory.create(:response, 
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