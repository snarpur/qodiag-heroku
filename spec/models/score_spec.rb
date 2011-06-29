require 'spec_helper'

describe Score do
  describe "scopes" do
    before(:each) do
      names = ["symptom_a","symptom_b","symptom_total"]
      values = [3,4,6]
      names.each_with_index do |name,index|
        Factory(:score, :name => name, :average => values[index])
      end
    end
  end
end
