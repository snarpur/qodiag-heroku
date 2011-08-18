require 'spec_helper'

describe Score do
  describe "scopes" do
    before(:each) do
      names = ["symptom_a","symptom_b","symptom_total"]
      result_names = ["average","standard"]
      values = [3,4,6]
      names.each_with_index do |n,index|
        Factory(:score, :name => n, :result_name => result_names[index%2], :value => 5)
      end
    end
    it { Score.result_name('average').length.should == 2 }
    it { Score.score_name('symptom_a').length.should == 1 }
    it { Score.get_score('symptom_a','average').length.should == 1 }
  end

  describe "get values" do
    before(:each) do
      @range_value = Factory(:score, :name => "symptom_x", :result_name => "average", :start_value => 5, :end_value => 10)
      @value = Factory(:score, :name => "symptom_x", :result_name => "average", :value => 5)
    end

    it { @range_value.get_value.should == @range_value.get_range_span }
    it { @value.get_value.should == 5 }
  end
end
