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

  context "setting association on subject", :focus => true do
    before do
        @item = ResponderItem.create(:registration_identifier => "strange_days")
        @caretaker = @item.create_caretaker(:firstname => "Fritz")
        @item.create_client(:firstname => "John")
        KK.see@caretaker
    end
    it "if no subject id is submitted" do

      # item.caretaker = Factory(:person)
      # item.client = Factory(:person)
      KK.see @item.inspect
      # item.subject.should_not be_nil
    end
  end


end
