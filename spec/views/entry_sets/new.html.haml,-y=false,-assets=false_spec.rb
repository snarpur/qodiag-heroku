require 'spec_helper'

describe "entry_sets/new" do
  before(:each) do
    assign(:entry_set, stub_model(EntrySet,
      :name => "MyString",
      :created_by_id => 1,
      :description => "MyString",
      :type => ""
    ).as_new_record)
  end

  # it "renders new entry_set form" do
  #   render

  #   # Run the generator again with the --webrat flag if you want to use webrat matchers
  #   assert_select "form[action=?][method=?]", entry_sets_path, "post" do
  #     assert_select "input#entry_set_name[name=?]", "entry_set[name]"
  #     assert_select "input#entry_set_created_by_id[name=?]", "entry_set[created_by_id]"
  #     assert_select "input#entry_set_description[name=?]", "entry_set[description]"
  #     assert_select "input#entry_set_type[name=?]", "entry_set[type]"
  #   end
  # end
end
