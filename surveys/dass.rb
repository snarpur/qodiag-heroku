require "#{Rails.root}/lib/util/survey_DSL_helpers.rb"
survey_name = 'DASS'
namespace = SurveyDSLHelpers.access_code(survey_name)
params = {:common_namespace => namespace, :pick => :one, :display_type => :inline, :custom_class => 'survey-question pick-one'}

ratings =  ["false",  "sometimes",  "often", "true"]

dass = [
  {:question_group => 'depression', :order => [3,5,10,13,16,17,21,24,26,31,34,37,38,42]},
  {:question_group => 'anxiety', :order => [2,4,7,9,15,19,20,23,25,28,30,36,40,41]},
  {:question_group => 'stress', :order => [1,6,8,11,12,14,18,22,27,29,32,33,35,39]}
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