namespace :db do
  desc "Erase and fill database"
  task :populate => :environment do

    def random_date(years_back=5)
      year = Time.now.year - rand(years_back) - 1
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


     surveys = ["adhd_rating_scale", "quiz", "hsq_r"]
     surveys.each do |survey|
       system "bundle exec rake surveyor FILE=surveys/#{survey}.rb"
     end

     NormReferenceParser.new('adhd_rating_scale')

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
          patient.dateofbirth = random_date(rand(11) + 5)
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
            item_count = 0
           ResponderItem.populate 8 do |item|
              new_survey_id = item_count < 4 ? rand(3) + 1 : 1
              item.client_id = parent.id
              item.subject_id = patient.id
              item.caretaker_id = caretaker.id
              if item_count < 4
                date = Time.now - rand(2).weeks
                item.created_at = date
                deadline = date.advance(:weeks =>2)
                item.deadline = deadline
                item.completed = date - 1.days if item_count < 1
              else
                date = Time.now - rand(100).weeks
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
              item_count += 1
              ResponseSet.populate 1 do |set|
                set.survey_id = new_survey_id
                set.access_code = "new-acss" << item.id.to_s
                set.user_id = client_user.id
                item.response_set_id = set.id

              end
            end
          end
        end
      end
    end
  end
end