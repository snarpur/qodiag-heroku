#IMPORTANT: Change to ActionController
class ResponderItems::SurveyResponsesController < ActionController::Base
  
  def question_group

    @responses = ResponderItem.find(params[:id]).group_result(params[:question_group_name])
  end


  def column
    @chart = ResponderItem.find(params[:id]).response_to_chart(params.slice(:column_metrics,:norm_reference_id))
  end


end