namespace :db do
  desc "Erase and fill database"
  task :populate => :environment do

    def random_date(years_back=5)
      year = Time.now.year - years_back
      month = rand(12) + 1
      day = rand(31) + 1
      Time.local(year, month, day)
    end
    require "#{Rails.root}/lib/util/populate_util.rb"
    require 'faker'

    Rake::Task["db:reset"].invoke
    #[Person, User, Right, Relationship].each(&:delete_all)
    
    sex = ['male','female']
    caretaker = Role.find_by_name('caretaker')
    client = Role.find_by_name('client')
    password_params = {:password => "asdfkj", :password_confirmation => "asdfkj"}
    
    surveys = ["adhd_rating_scale","sdq"]
    surveys.each do |survey|
      system "bundle exec rake surveyor FILE=surveys/#{survey}.rb --trace"
      NormReferenceParser.new(survey)
    end


    ["jon","gunnar","svenni"].each do |u|
      caretaker_person = Factory.create(:person, PopulateUtil.fullname)
      caretaker_user = Factory.create(:user, 
                                      :email => "#{u}@snarpurland.is", 
                                      :roles => [caretaker], 
                                      :person => caretaker_person
                                     )
      patient = Factory.create(:person, PopulateUtil.fullname.merge({:dateofbirth => random_date(5)}))
      Factory.create(:patient_relationship, :person => caretaker_person, :relation => patient)

      parent_person = Factory.create(:person, PopulateUtil.fullname)
      parent_user = Factory.create(:user, 
                                   :email => Faker::Internet.email, 
                                   :roles => [client], 
                                   :person => parent_person
                                  )
      Factory.create(:guardian_relationship, :person => parent_person, :relation => patient)
      Factory.create(:parent_relationship, :person => parent_person, :relation => patient)
      
      created_at = Time.now - rand(30).days
      deadline = created_at.advance(:weeks =>2)
      completed_at = created_at.advance(:days => 1)
      


      responder_item = Factory.create( :item_with_people, 
                      :client => parent_person, 
                      :subject => patient, 
                      :caretaker => caretaker_person,
                      :survey_id => 1,
                      :created_at => created_at,
                      :deadline => deadline
                      )
      
      response_set = responder_item.response_set
      response_set.completed_at = completed_at
      response_set.save!
              
      survey_sections = SurveySection.where(responder_item.survey_id).select(:id)

      survey_sections.each do |section|
        questions = Question.where("survey_section_id = #{section.id}")
        questions_size = questions.size
        questions.each do |question|
          answers = question.answers 
          Factory.create(:response, 
                         :response_set => response_set, 
                         :question_id => question.id,
                         :answer_id => answers[rand(answers.size)].id 
                        )
        end
      end
      

    end
  end
end