require 'spec_helper'

describe "entry_values/show" do
  before(:each) do
    @entry_value = assign(:entry_value, stub_model(EntryValue,
      :entry_field_id => 1,
      :entry_set_responses_id => 2,
      :string_value => "String Value",
      :text_value => "MyText"
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/1/)
    rendered.should match(/2/)
    rendered.should match(/String Value/)
    rendered.should match(/MyText/)
  end
end
