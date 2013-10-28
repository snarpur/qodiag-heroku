# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :national_register do
    kennitala "0102783419"
    fjolskyldunumer "MyString"
    bannmerki "MyString"
    nafn "MyString"
    postnumer 1
    heimili "MyString"
    sveitarfelag 1
    lastchanged 1
    kyn 1
    hjuskaparstada "MyString"
    ktmaka "MyString"
    rikisfang "MyString"
    faedingarstadur "MyString"
    latinn 1
  end
end
