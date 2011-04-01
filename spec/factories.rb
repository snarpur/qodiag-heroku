require 'factory_girl'

Factory.define :user do |user|
    user.sequence(:email) {|n| "person#{n}@example.com"}
    user.password '123456'
    user.password_confirmation '123456'
    user.roles {|roles| [roles.association(:role)]}
end

Factory.define :role do |role|
   role.name "snake"
end

Factory.define :super_admin, :class => :user do |user|
    user.sequence(:email) {|n| "person#{n}@example.com"}
    user.password '123456'
    user.password_confirmation '123456'
    user.roles {|roles| [roles.association(:role, :name => "super_admin")]}
end




# Factory.define :person do |p|
#   p.firstname "kalli"
#   p.lastname "bubbi"
#   p.dateofbirth "121212"
#   p.cpr "1212"
#   #p.address {|address| address.association(:address, :street_1 => 'cobra boulevard') }
#   p.association :address, :factory => :address
# end
#
# Factory.define :address do |a|
#   a.street_1 "Strandgata"
# end
