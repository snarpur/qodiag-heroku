# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

users = ["super_admin", "caretaker", "client"]

users.each do |u|
  user = User.create(:email => "#{u}@orrigautur.com", :password => "asdfkj", :password_confirmation => "asdfkj")
  user.roles.create(:name => u)
  user.create_person(:firstname => "Per #{u}", :lastname => "Mc#{u.capitalize}")
end


