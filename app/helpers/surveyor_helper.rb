module SurveyorHelper
  include Surveyor::Helpers::SurveyorHelperMethods
  
  # Questions
  # def q_text(question, context, locale)
  #   return I18n.t("surveys.#{question.common_namespace}.questions")[question.display_order] 
  # end

  def q_text(question, context, locale)
    arr = question.display_order.to_s.split(".")
    return super if arr.empty?
    #Question index
    q_i = arr[0].to_i
    
    #Subquestion index
    s_i = arr[1].to_i 

    if arr[1] == "0"
      if question.pick == "none"
        return q_i.to_s + ") " +I18n.t("surveys.#{question.common_namespace}.questions")[q_i]["header"] 
      else
        return q_i.to_s + ") " +I18n.t("surveys.#{question.common_namespace}.questions")[q_i]
      end
    else
      return q_i.to_s + " " +I18n.t("surveys.#{question.common_namespace}.questions")[q_i]["subquestions"][(s_i - 1)]
    end
  end

end