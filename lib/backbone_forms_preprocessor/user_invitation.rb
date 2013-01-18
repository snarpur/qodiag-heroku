#TODO: Create registration form when respondent is guardian only
class BackboneFormsPreprocessor::UserInvitation < BackboneFormsPreprocessor::Base
  include ActiveAttr::Model

  attr_accessor :user

  def user
    @root_object.respondent.user.model
  end

  def invited_by
    @root_object.model.caretaker.user
  end

  def complete_callback
    user.invite!(invited_by) if user.password.nil? && user.invitation_accepted_at.nil?
  end

end
