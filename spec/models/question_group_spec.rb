require 'spec_helper'
describe QuestionGroup do
  describe "scopes" do
    before(:each) do
      @names = ['first_group','second_group']
      @names.each do |name|
        2.times {QuestionGroup.create(:text => name)}
      end
    end
    it "should list all question group names once" do
      QuestionGroup.names.length.should == @names.length
      QuestionGroup.names.last.should_not == QuestionGroup.names.first
    end
  end
end