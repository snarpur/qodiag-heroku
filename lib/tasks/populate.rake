namespace :db do
  desc "Erase and fill database"
  task :populate => :environment do
      require 'populator'
      require 'faker'
    Rake::Task["db:reset"].invoke
    sex = ['male','female']
    caretaker_id = Role.find_by_name('caretaker').id
    client_id = Role.find_by_name('client').id
    password_params = {:password => "asdfkj", :password_confirmation => "asdfkj"}
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
        Person.populate 1 do |patient|
          patient.firstname = Faker::Name.first_name
          patient.lastname = Faker::Name.last_name
          patient.sex = sex[rand(2)]
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
           ResponderItem.populate 1 do |item|
              item.client_id = parent.id
              item.subject_id = patient.id
              item.caretaker_id = caretaker.id
              item.deadline = Date.current.advance(:weeks =>2)
              item.registration_identifier = 'client_registration'
            end
          end
        end
      end
    end
  end
end