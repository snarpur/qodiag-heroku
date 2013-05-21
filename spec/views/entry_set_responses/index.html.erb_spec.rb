require 'spec_helper'

describe "entry_set_responses/index" do
  before(:each) do
    assign(:entry_set_responses, [
      stub_model(EntrySetResponse,
        :entry_set_id => 1,
        :responder_item_id => 2
      ),
      stub_model(EntrySetResponse,
        :entry_set_id => 1,
        :responder_item_id => 2
      )
    ])
  end

  it "renders a list of entry_set_responses" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => 1.to_s, :count => 2
    assert_select "tr>td", :text => 2.to_s, :count => 2
  end
end
