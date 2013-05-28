# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :entry_value do
    entry_field_id 1
    entry_set_responses_id 1
    string_value "MyString"
    text_value "MyText"
  end
end
