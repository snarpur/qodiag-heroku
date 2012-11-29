#TODO: Create registration form when respondent is guardian only
class BackboneFormsPreprocessor::UserInvitation < BackboneFormsPreprocessor::Base
  include ActiveAttr::Model

  attr_accessor :user
  
  def user
    @root_object.respondent.user
  end

end
