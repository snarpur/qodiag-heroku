# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :entry_field do
    title "MyString"
    description "MyText"
    help_text "MyString"
    field_type "MyString"
    parent_field_id 1
    visibility "1"
  end
end
