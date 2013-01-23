#TODO: Create registration form when respondent is guardian only
class BackboneFormsPreprocessor::PreRegistration < BackboneFormsPreprocessor::Base
  include ActiveAttr::Model
  attr_accessor :responder_item

  def complete_callback
    @root_object.completed= DateTime.current
    @root_object.save
  end

  def redirect_url_on_complete
    Rails.application.routes.url_helpers.users_path
  end


 end