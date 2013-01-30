class BackboneFormsPreprocessor::PreRegistration < BackboneFormsPreprocessor::Base
  include ActiveAttr::Model
  attr_accessor :responder_item

  DEFAULT_TEMPLATE = "pre_registration"

  def complete_callback
    @root_object.completed= DateTime.current
    @root_object.save
  end

  def form_template_identifier(template_name)  
    sub_template = @root_object.respondent.is_parent_and_guardian_of?(@root_object.subject) ? "as_guardian_and_parent" : "as_guardian"
    "#{DEFAULT_TEMPLATE}_#{sub_template}"
  end 
  
  def redirect_url_on_complete
    Rails.application.routes.url_helpers.users_path
  end
 end