require "#{Rails.root}/lib/util/survey_DSL_helpers.rb"
ratings = ["never", "sometimes","often","everyday"]
name = "ADHD Rating Scale"
namespace = SurveyDSLHelpers.access_code(name)
params = {:common_namespace => namespace, :pick => :one, :display_type => :inline}
survey name do
  section namespace do
    group "inattention" do
      order = 0
      9.times do |s|
        q namespace, params.merge({:display_order => order})
        ratings.each_index { |r| a ratings[r], :weight => r, :common_namespace => params[:common_namespace]}
        order += 2
      end
    end
    group "impulsivity_hyperactivity" do
      order = 1
      9.times do |s|
        q namespace, params.merge({:display_order => order})
        ratings.each_index { |r| a ratings[r], :weight => r, :weight => r, :common_namespace => params[:common_namespace]}
        order += 2
      end
    end
  end
end