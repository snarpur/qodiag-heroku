# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :entry_field_option do
    entry_field_id 1
    text_option "MyString"
  end
end
