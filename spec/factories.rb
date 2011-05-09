require 'factory_girl'

Factory.define :user do |user|
    user.sequence(:email) {|n| "person#{n}@example.com"}
    user.password '123456'
    user.password_confirmation {|a| a.password}
    user.person { |person| person.association(:person) }
    user.roles { |roles| [roles.association(:role)] }
end

Factory.define :role do |role|
   role.name "snake"
end


Factory.define :person do |person|
  person.firstname "John Smith"
  person.sex "male"
end


Factory.define :invitation_responder_item, :class => ResponderItem do |item|
  item.registration_identifier "strange_days"
  item.caretaker { |caretaker| caretaker.association(:person) }
  item.client { |client| client.association(:person) }
  item.subject nil
  item.deadline Time.zone.now.advance(:weeks => 2)
end