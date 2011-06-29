require "spec_helper"

describe RequestNotice do
  describe "send survey request" do
    before do
      @responder_item = Factory(:survey_item_with_people)
      @email = RequestNotice.request_survey(@responder_item)
    end
    it "does something" do
      @email.should deliver_to(@responder_item.client.user_email)
    end
  end
end
