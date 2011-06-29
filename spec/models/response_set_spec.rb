require 'spec_helper'
describe ResponseSet do
  describe "update responder item when completed" do
    before(:each) do
      @responder_item = Factory(:survey_item_with_people)
      @set = @responder_item.response_set
      @set.complete!
      @set.save
      @responder_item.reload

    end
    it "should update responder_item to completed" do
      @set.completed_at.to_date.should == @responder_item.completed.to_date
    end
    it "gets responder item and its accosiated objects" do
      @set.responder_item.should == @responder_item
      @set.responder.should == @responder_item.client
      @set.subject.should == @responder_item.subject
    end
  end
  describe "find group names" , :focus => true do
    before(:each) do
      @names = ["first_group","second_group"]
      @question_groups = @names.map{|g|Factory(:question_group, :text => g)}
      @response_set = Factory(:response_set)
      4.times do |i|
        question = Factory(:question, :question_group => @question_groups[i%2])
        answer = Factory(:answer, :weight => i%2 + 2)
        Factory(:response, :response_set => @response_set, :answer => answer, :question => question)
      end
    end

    it "should have correct group names" do
      @response_set.group_names.length.should == @names.length
    end

    it "should have correct total for question_group" do
      @response_set.group_result('second_group').should == 6
      @response_set.group_result('first_group').should == 4
    end

  end
end