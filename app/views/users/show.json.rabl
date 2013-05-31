object @user
attributes :email, :person_id, :role_name
attributes :role => :role_name
node do |user|
  partial("users/#{user.role_name}", :object => user.person)
end