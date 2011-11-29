namespace :db do
  desc "Erase and fill database"
  task :populate => :environment do

    def random_date(years_back=5)
      year = Time.now.year - years_back
      month = rand(12) + 1
      day = rand(31) + 1
      Time.local(year, month, day)
    end


    require 'populator'
    require 'faker'
    Rake::Task["db:reset"].invoke
    sex = ['male','female']
    caretaker_id = Role.find_by_name('caretaker').id
    client_id = Role.find_by_name('client').id
    password_params = {:password => "asdfkj", :password_confirmation => "asdfkj"}


     surveys = ["adhd_rating_scale","sdq"]
     surveys.each do |survey|
       system "bundle exec rake surveyor FILE=surveys/#{survey}.rb"
     end

     NormReferenceParser.new('adhd_rating_scale')
     NormReferenceParser.new('sdq')

    ["jon","gunnar","svenni"].each do |user|
      user = User.create({:email => "#{user}@snarpurland.is"}.merge!(password_params))
      Right.populate 1 do |right|
        right.user_id = user.id
        right.role_id = caretaker_id
      end
      Person.populate 1 do |caretaker|
        caretaker.firstname = Faker::Name.first_name
        caretaker.lastname = Faker::Name.last_name
        user.update_attribute(:person_id, caretaker.id)
        Person.populate 6 do |patient|
          patient.firstname = Faker::Name.first_name
          patient.lastname = Faker::Name.last_name
          patient.sex = sex[rand(2)]
          patient.dateofbirth = random_date(5)
          patient.ispatient = true
          Person.populate 1 do |parent|
            client_user = User.create({:email => Faker::Internet.email}.merge!(password_params))
            client_user.update_attribute(:person_id, parent.id)
            Right.populate 1 do |right|
              right.user_id = client_user.id
              right.role_id = client_id
            end
            parent.firstname = Faker::Name.first_name
            parent.lastname = Faker::Name.last_name
            parent.sex = sex[rand(2)]
            parent_child = ["parent","guardian"]

            Relationship.populate 2 do |r_child|
              r_child.person_id = parent.id
              r_child.relation_id = patient.id
              r_child.name = parent_child.pop
            end
            Relationship.populate 1 do |r_patient|
              r_patient.person_id = caretaker.id
              r_patient.relation_id = patient.id
              r_patient.name = "patient"
            end
            item_type = ['survey','registration']
            item_status = ['completed','uncompleted','overdue']
            item_count = -1
           ResponderItem.populate 15 do |item|
              item_count += 1
              new_survey_id = rand(surveys.length) + 1
              item.client_id = parent.id
              item.subject_id = patient.id
              item.caretaker_id = caretaker.id
              if item_count < 4                  ## Pending
                date = Time.now - rand(20).days
                item.created_at = date
                deadline = date.advance(:weeks =>2)
                item.deadline = deadline
                item.completed = date - 1.days if item_count < 1 ## first is completed
              else
                date = Time.now - rand(800).days
                item.created_at = date
                deadline = date.advance(:weeks =>2)
                item.deadline = deadline
                item.completed = date - 1.days
              end
              if item_type.last == 'registration'
                item.registration_identifier = 'client_registration'
                item_type.pop
              else
                 item.survey_id = new_survey_id
              end
              unless item.completed.nil?
                ResponseSet.populate 1 do |set|
                  set.survey_id = new_survey_id
                  set.access_code = "new-acss" << item.id.to_s
                  set.user_id = client_user.id
                  item.response_set_id = set.id
                  set.completed_at = item.completed
                  survey_sections = SurveySection.where(item.survey_id).select(:id)
                  survey_sections.each do |section|
                    questions = Question.where("survey_section_id = #{section.id}")
                    questions_size = questions.size
                    questions.each do |question|
                      answers = question.answers 
                      Response.populate 1 do |response|
                        response.response_set_id = set.id
                        response.question_id = question.id
                        response.answer_id = answers[rand(answers.size)].id
                      end
                    end
                  end
                end
              end 
            end
          end
        end
      end
    end
  end
end