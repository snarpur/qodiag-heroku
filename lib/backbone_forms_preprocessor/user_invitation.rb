class BackboneFormsPreprocessor::UserInvitation < BackboneFormsPreprocessor::Base
  include ActiveAttr::Model

  attr_accessor :user

  def user
    @root_object.respondent.user
  end

  def invited_by
    @root_object.caretaker.user
  end

  def complete_callback
    user.invite!(invited_by) if (user.password.nil? && user.invitation_accepted_at.nil? && user.invitation_token.nil?)
    @complete = true
  end

  def redirect_url_on_complete
    if @complete
      Rails.application.routes.url_helpers.subject_responder_items_path(@root_object.subject_id)
    end
  end

end
