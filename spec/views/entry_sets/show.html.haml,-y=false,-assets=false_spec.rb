require 'spec_helper'

describe "entry_sets/show" do
  before(:each) do
    @entry_set = assign(:entry_set, stub_model(EntrySet,
      :name => "Name",
      :created_by_id => 1,
      :description => "Description",
      :type => "Type"
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Name/)
    rendered.should match(/1/)
    rendered.should match(/Description/)
    rendered.should match(/Type/)
  end
end
