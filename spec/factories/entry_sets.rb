# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :entry_set do
    name "MyString"
    created_by_id 1
    description "MyString"
    type ""
  end
end