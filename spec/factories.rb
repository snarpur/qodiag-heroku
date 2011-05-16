require 'factory_girl'
require 'faker'

Factory.define :user do |user|
    user.sequence(:email) {|n| "person#{n}@example.com"}
    user.password '123456'
    user.password_confirmation {|a| a.password}
    user.person { |person| person.association(:person) }
    user.roles { |roles| [roles.association(:role)] }
end

Factory.define :simple_client, :class => User do |user|
    user.sequence(:email) {|n| "person#{n}@example.com"}
    user.password '123456'
    user.password_confirmation {|a| a.password}
    user.role_ids '3'
    user.invited_by_id nil

end



Factory.define :role do |role|
   role.name "snake"
end

Factory.define :address do |address|
  address.street_1 "nonni"
end


Factory.define :person do |person|
  person.firstname Faker::Name.first_name
  person.lastname Faker::Name.last_name
  person.sex "male"
end


Factory.define :overdue_registration, :class => ResponderItem do |item|
  item.registration_identifier "strange_days"
  item.caretaker { |caretaker| caretaker.association(:person) }
  item.client { |client| client.association(:person) }
  item.subject { |client| client.association(:person) }
  item.deadline Time.zone.now.advance(:weeks => 2)
end