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