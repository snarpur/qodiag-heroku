require 'factory_girl'
require 'faker'

Factory.define :user do |user|
    user.sequence(:email) {|n| "person#{n}_#{rand(100000)}@example.com"}
    user.password 'asdfkj'
    user.password_confirmation {|a| a.password}
    user.person { |person| person.association(:person) }
    user.roles { |roles| [roles.association(:role)] }
end


Factory.define :caretaker_user, :parent => :user do |user|
    user.roles { |roles| [roles.association(:role, :name => 'caretaker')] }
end

Factory.define :client_user, :parent => :user do |user|
    user.roles { |roles| [roles.association(:role, :name => 'client')] }
end

Factory.define :simple_client, :class => User do |user|
    user.sequence(:email) {|n| "person#{n}_#{rand(100000)}@example.com"}
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
  person.firstname "jon"
  person.lastname "smith"
  person.sex {["male","female"].at(rand(2))}
end

Factory.define :client_person, :parent => :person do |person|
  person.association :user, :factory => :client_user
end

Factory.define :caretaker_person, :parent => :person do |person|
  person.association :user, :factory => :caretaker_user
end

Factory.define :patient_relationship,:class => Relationship do |relationship|
  relationship.name 'patient'
  relationship.relation { |person| person.association(:person) }
  relationship.person  { |person| person.association(:person) }
end

Factory.define :guardian_relationship,:class => Relationship do |relationship|
  relationship.name 'guardian'
  relationship.relation { |person| person.association(:person) }
  relationship.person  { |person| person.association(:person) }
end

Factory.define :parent_relationship,:class => Relationship do |relationship|
  relationship.name 'parent'
  relationship.relation { |person| person.association(:person) }
  relationship.person  { |person| person.association(:person) }
end

Factory.define :responder_item  do |item|
  item.registration_identifier "some_registration"
  item.deadline Time.zone.now.advance(:days => rand(30) + 2)
  item.created_at Time.zone.now
  item.completed nil
end

Factory.define :recently_completed_registration, :parent => :responder_item do |item|
  item.completed 1.day.ago
end

Factory.define :uncompleted_registration, :parent => :responder_item do |item|
  item.completed nil
end

Factory.define :overdue_registration, :parent => :responder_item do |item|
  item.deadline rand(20).days.ago
  item.completed nil
end

Factory.define :responder_item_as_nothing, :parent => :responder_item do |item|
  item.registration_identifier nil
end

Factory.define :survey_item, :parent => :responder_item do |item|
  item.registration_identifier nil
  item.association :survey
end

Factory.define :item_with_people, :parent => :responder_item do |item|
  item.association :client, :factory => :client_person
  item.association :caretaker, :factory => :caretaker_person
  item.association :subject, :factory => :person
end

Factory.define :survey_item_with_people, :parent => :item_with_people do |item|
  item.registration_identifier nil
  item.association :survey
end

Factory.define :norm_reference do |norm|
  norm.association :survey
  norm.age_start 5
  norm.age_end 7
  norm.sex 'male'
end

Factory.define :score do |score|
  score.name "symptom x"
  score.association :norm_reference
  score.result_name
  score.start_value
  score.end_value
  score.value
end

