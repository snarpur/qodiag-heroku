# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :entry_set_section, :class => 'EntrySetSections' do
    entry_set_id 1
    section_id 1
  end
end
