require 'spec_helper'
describe StackedColumnChart do
  before do

    age = 6
    ri = @responder_item = Factory(:survey_item_with_people)
    ri.subject.update_attribute(:dateofbirth, Time.zone.now - age.years)
    @response_set = @responder_item.response_set
    @norm_reference = Factory(:norm_reference, :age_start => age - 1, :age_end => age + 1, :sex => ri.subject.sex, :survey => @response_set.survey)
    @score_result_names = %w{good ok bad}
    @score_names = %w{body mind}
    @score_result_names.each_with_index do |result_name,index|
      @score_names.each{|name| Factory(:score, :result_name => result_name, :name => name, :value => index + 1, :norm_reference => @norm_reference) }
    end


    @question_groups = @score_names.map{|g|Factory(:question_group, :text => g)}
    4.times do |i|
      question = Factory(:question, :question_group => @question_groups[i%2])
      answer = Factory(:answer, :weight => 2)
      Factory(:response, :response_set => @response_set, :answer => answer, :question => question)
    end

    @config = YAML::load(File.open("#{Rails.root}#{APP_CONFIG['chart_config_path']}/test_stacked_column_chart.yml")).symbolize_all_keys!
  end

  describe "months" do
    it "does something" do
    chart = StackedColumnChart.new(@config, @response_set)


    end

  end
end