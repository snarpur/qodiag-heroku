class ResponderItems::SurveyResponsesController < ActionController::Base
  def question_group
    @responses = ResponderItem.find(params[:id]).group_result(params[:question_group_name])
  end
end