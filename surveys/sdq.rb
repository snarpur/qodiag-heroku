require "#{Rails.root}/lib/util/survey_DSL_helpers.rb"
survey_name = 'SDQ'
namespace = SurveyDSLHelpers.access_code(survey_name)
params = {:common_namespace => namespace, :pick => :one, :display_type => :inline}

ratings =  ["not true",  "somewhat true",  "certainly true"]
inverted_questions = [7,11,14,21,25]
sdq = [
  {:question_group => 'emotional', :order => [2,7,12,15,23]},
  {:question_group => 'conduct', :order => [4,6,11,17,21]},
  {:question_group => 'hyperactivity_inattention', :order => [1,9,14,20,24]},
  {:question_group => 'peer_problem', :order => [5,10,13,18,22]},
  {:question_group => 'prosocial_behaviour', :order => [0,3,8,16,19]}
]

impact_supplement  = [28,29,30,31,32,33]

survey survey_name do
  section namespace do
    sdq.each do |s|
      group s[:question_group] do
        s[:order].each do |order|
         q namespace, params.merge({:display_order => order})
         if inverted_questions.include?(order)
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