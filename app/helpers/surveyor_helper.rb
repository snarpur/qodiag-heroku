module SurveyorHelper
  include Surveyor::Helpers::SurveyorHelperMethods
  
  # Questions
  def q_text(question, context, locale)
    return I18n.t("surveys.#{question.common_namespace}.questions")[question.display_order] 
  end
end