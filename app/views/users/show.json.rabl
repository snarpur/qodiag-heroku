object @user
attributes :email, :person_id, :role_names
node do |user|
  partial("users/#{user.role_name}", :object => user.person)
end