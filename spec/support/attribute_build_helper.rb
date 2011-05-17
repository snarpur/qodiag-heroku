module AttributeBuildHelper

  def generate_attributes()


  end


end

# Factory.define :client_user_attributes, :class => User do |user|
#     user.sequence(:email) {|n| "person#{n}@example.com"}
#     user.password '123456'
#     user.password_confirmation {|a| a.password}
#     user.invited_by_id nil
#     user.roles_attributes :name => 'client'
#     user.person_attributes {
#                               Factory.attributes_for(:person,
#                                   :relationships_attributes => Factory.attributes_for(:relationships_attributes,
#                                       :relation_attributes => Factory.attributes_for(:relation,
#                                         :inverse_relationships_attributes => Factory.attributes_for(:inverse_relationships_attributes, :relation_id => user.invited_by_id))))
#
# end