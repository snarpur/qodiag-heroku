require "#{Rails.root}/lib/util/survey_DSL_helpers.rb"
survey_name = 'SDQ'
namespace = SurveyDSLHelpers.access_code(survey_name)
params = {:common_namespace => namespace, :pick => :one, :display_type => :inline, :custom_class => 'survey-question pick-one'}

ratings =  ["not true",  "somewhat true",  "certainly true"]
#To match with the question number
inverted_questions = [1,4,9,17,20]

#To match with the question number
sdq = [
  {:question_group => 'emotional', :order => [3,8,13,16,24]},
  {:question_group => 'conduct', :order => [5,7,12,18,22]},
  {:question_group => 'hyperactivity_inattention', :order => [2,10,15,21,25]},
  {:question_group => 'peer_problem', :order => [6,11,14,19,23]},
  {:question_group => 'prosocial_behaviour', :order => [1,4,9,17,20]}
]

#To match with the question number
impact_supplement  = [29,30,31,32,33,34]

survey survey_name do
  section namespace do
    sdq.each do |s|
      group s[:question_group] do
        s[:order].each do |order|
         q namespace, params.merge({:display_order => order})
         if !inverted_questions.include?(order)
           ratings.each_index { |r| a ratings[r], :weight => r, :common_namespace => params[:common_namespace] }
         else
           inverse = ratings.reverse
           inverse.each_index { |r| a inverse[r], :weight => r, :common_namespace => params[:common_namespace] }
         end
        end
      end
    end
  end
end