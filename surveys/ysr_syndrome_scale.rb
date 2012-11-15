require "#{Rails.root}/lib/util/survey_DSL_helpers.rb"
survey_name = 'YSR Syndrome Scale'
namespace = SurveyDSLHelpers.access_code(survey_name)
params = {:common_namespace => namespace, :pick => :one, :display_type => :inline}
ratings =  ["not true",  "somewhat true or sometimes true",  "very true often true"]

questionnaire_definition = [
  {:question_group => 'anxious_or_depressed', :common_identifier => "internalizing",  :order => [14,29,30,31,32,33,35,45,50,52,71,91,112]},
  {:question_group => 'withdrawn_or_depressed', :common_identifier => "internalizing", :order => [5,42,65,69,75,102,103,111]},
  {:question_group => 'somatic_complaints', :common_identifier => "internalizing", :order => [47,51,54,56]},
  {:question_group => 'social_problems', :common_identifier => "",:order => [11,12,25,27,34,36,38,48,62,64,79]},
  {:question_group => 'thought_problems', :common_identifier => "", :order => [9,18,40,46,58,66,70,76,83,84,85,100]},
  {:question_group => 'attention_problems', :common_identifier => "", :order => [1,4,8,10,13,17,41,61,78]},
  {:question_group => 'rule_breaking_behaviour', :common_identifier => "externalizing", :order => [2,26,28,39,43,63,67,72,81,82,90,96,99,101,105]},
  {:question_group => 'aggressive_behaviour', :common_identifier => "externalizing", :order => [3,16,19,20,21,22,23,37,57,68,86,87,89,94,95,97,104]},
  {:question_group => 'other_problems', :common_identifier => "", :order => [7,24,44,53,55,56,74,77,93,110]}
]


survey survey_name do
  section namespace do
    questionnaire_definition.each do |s|
      group s[:question_group], :common_identifier => s[:common_identifier] do
        s[:order].each do |order|
         q namespace, params.merge({:display_order => order})
           ratings.each_index { |r| a ratings[r], :weight => r, :common_namespace => params[:common_namespace] }
         end
      end
    end
  end
end
