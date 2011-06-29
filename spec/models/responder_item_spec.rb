require 'spec_helper'

describe ResponderItem do

  context "setting item status to completed" do
    it "should set completed to Time.now if completed attribute is submitted" do
      item = ResponderItem.create(:complete_item => "", :registration_identifier => "some_identifier")
      item.completed.should_not be_nil
      item.completed.to_s.should eq(item.updated_at.to_s)
    end

    it "should not set completed Time.now if attribute is not submitted" do
      item = ResponderItem.create(:registration_identifier => "another_identifier")
      item.completed.should be_nil
    end
  end

  describe "create patient responder item as survey" do
    before do
      @setup = setup_patient
      @item = ResponderItem.new_patient_item(@setup[:patient],@setup[:caretaker].person)
      @item.survey = Factory(:survey)
      @item.save
    end
    it "should have a parent" do
      @item.client.should == @setup[:patient].guardian_client
    end
    it "should have a response_set" do
      @item.response_set.should_not be_nil
    end

  end
  context "scopes" do
    it "surveys" do
      Factory(:survey_item)
      ResponderItem.surveys.size.should == 1
    end
    it "registrations" do
      Factory(:responder_item)
      ResponderItem.registrations.size.should == 1
    end
  end
  context "validations" do
    context "has survey or registration identifier" do
      it "if not survey nor registraion should be invalid" do
        item = Factory.build(:responder_item_as_nothing)
        item.valid?
        item.should be_invalid
      end
      it "as survey should be valid" do
        item = Factory.build(:survey_item)
        item.valid?
        item.should be_valid
      end
      it "as registration should be valid" do
        item = Factory.build(:responder_item)
        item.valid?
        item.should be_valid
      end
    end
  end
end
