users = ["super_admin", "caretaker", "client"]

users.each do |u|
  user = User.create(:email => "#{u}@orrigautur.com", :password => "asdfkj", :password_confirmation => "asdfkj")
  user.save
  user.roles.create(:name => u)
  user.create_person(:firstname => "Per #{u}", :lastname => "Mc#{u.capitalize}")
end
