require 'spec_helper'

describe NormReference do
  context "common finders" do
    before(:each) do
      @norm_1 =  NormReference.create(:sex => 'male', :age_start => 7, :age_end => 9)
      @norm_2 =  NormReference.create(:sex => 'female', :age_start => 4, :age_end => 5)
      @survey = FactoryGirl.create(:survey, :title => "My new survey")
      @norm_1.survey = @survey
      @norm_1.save

    end

    it "finds correct sex" do
      NormReference.sex(:male).should include(@norm_1)
      NormReference.sex(:male).should_not include(@norm_2)
    end

    it "finds correct age" do
      NormReference.age(8).should include(@norm_1)
      NormReference.age(8).should_not include(@norm_2)
    end

    it "finds survey" do
      NormReference.survey(@survey.id).should include @norm_1
    end
  end
end
