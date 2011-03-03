# Factory.define :user do |u|
#   u.email { "foo@example.com" }
#   u.password { "foobar" }
#   u.password_confirmation { |p| p.password }
#   u.assocciation :role
# end
# 
# Factory.define :role do |r|
#   r.name { 'fucked-up role' }
# end
# # 
# Factory.define :user_with_role, :parent => :user do |user|
#   user.after_create { |a| Factory(:role, :user => a) }
# end
# 

# Factory.define :user do |m|
#   m.email { "foo@example.com" }
#   m.password { "foobar" }
#   m.password_confirmation { |p| p.password }
#   m.association :role, :factory => :role
# end
# 
# Factory.define :role do |r|
#   r.name {"name"}
# end

Factory.define :user do |f|
  f.email 'someone@somecompany.com'
  f.password '123456'
end

Factory.define :role do |r|
  r.name 'testrole'
end




