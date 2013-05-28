require 'spec_helper'

describe "entry_sets/index" do
  before(:each) do
    assign(:entry_sets, [
      stub_model(EntrySet,
        :name => "Name",
        :created_by_id => 1,
        :description => "Description",
        :type => "Type"
      ),
      stub_model(EntrySet,
        :name => "Name",
        :created_by_id => 1,
        :description => "Description",
        :type => "Type"
      )
    ])
  end

  it "renders a list of entry_sets" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => 1.to_s, :count => 2
    assert_select "tr>td", :text => "Description".to_s, :count => 2
    assert_select "tr>td", :text => "Type".to_s, :count => 2
  end
end
