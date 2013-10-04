require "#{Rails.root}/lib/util/survey_DSL_helpers.rb"
survey_name = 'DASS'
namespace = SurveyDSLHelpers.access_code(survey_name)
params = {:common_namespace => namespace, :pick => :one, :display_type => :inline}

ratings =  ["false",  "sometimes",  "often", "true"]
dass = [
  {:question_group => 'depression', :order => [2,4,9,12,15,16,20,23,25,30,33,36,37,41]},
  {:question_group => 'anxiety', :order => [1,3,6,8,14,18,19,22,24,27,29,35,39,40]},
  {:question_group => 'stress', :order => [0,5,7,10,11,13,17,21,26,28,31,32,34,38]}
]

survey survey_name do
  section namespace do
    dass.each do |s|
      group s[:question_group] do
        s[:order].each do |order|
          q namespace, params.merge({:display_order => order})
          ratings.each_index { |r| a ratings[r], :weight => r, :common_namespace => params[:common_namespace] }         
        end
      end
    end
  end
end