# require 'factory_girl'
# require 'faker'



FactoryGirl.define do


  sequence(:random_deadline) {|n| Time.zone.now.advance(:days => rand(30) + 2) }
  sequence(:email) {|n| "persona#{n}_#{rand(10000)}@example.com"}

  factory :user do
    email {generate(:email)}
    password 'asdfkj'
    password_confirmation {|a| a.password}
    person
    
    factory :caretaker_user do
      #after_create do |user|
      after(:create) do |user|
        FactoryGirl.create(:caretaker_rights, user: user)
      end
    end

    factory :respondent_user do
      #after_create do |user|
      after(:create) do |user|
        FactoryGirl.create(:respondent_rights, user: user)
      end
    end
  end




  factory :role do 
    name "nmbnm"
  end

  factory :right do
    #ROLES = {:super_admin => 1,:caretaker => 2, :respondent => 3}
    factory :caretaker_rights do
      role_id 2
    end

    factory :respondent_rights do
      role_id 3
    end
  end

  factory :address do 
    street_1 "nonni"
  end

  sequence(:fullcpr) do |n| 
    year = rand(2000) + 1
    month = rand(12) + 1
    day = rand(31) + 1
    dateofbirth = Time.local(year, month, day)
    "#{dateofbirth.strftime('%d%m%y')}1289"
  end

  factory :person do
    firstname "jon"
    lastname "smith"
    sex {["male","female"].at(rand(2))}
    full_cpr {generate(:fullcpr)}

    factory :caretaker_person do
      association :user, factory: :caretaker_user
    end

    factory :respondent_person do
      association :user, factory: :respondent_user
    end
  end

  factory :relationship do
    association :person, factory: :person
    association :relation, factory: :person
    factory :patient_relationship do
      name "patient"
    end
    
    factory :guardian_relationship do
      name "guardian"
    end

    factory :parent_relationship do
      name "parent"
    end

    factory :respondent_relationship do
      name "respondent"
    end
  end



  factory :responder_item do
    deadline {generate(:random_deadline)}
    created_at Time.zone.now
    completed nil

    factory :recently_completed_registration do
      completed { 1.day.ago}
    end

    factory :uncompleted_registration do
      completed nil
    end

    factory :overdue_registration do 
      deadline {rand(20).days.ago}
      completed nil
    end

    factory :responder_item_as_nothing do 
      registration_identifier nil
    end

    factory :survey_item do
      registration_identifier nil
      survey
    end
  
    factory :item_with_people do 
      association :respondent, :factory => :respondent_person
      association :caretaker, :factory => :caretaker_person
      association :subject, :factory => :person
    

      factory :survey_item_with_people do 
        registration_identifier nil
        survey
      end
    end
  end


  factory :norm_reference do 
    age_start 5
    age_end 7
    sex 'male'
    survey
  end

  factory :score do
    name "symptom x"
    result_name nil
    start_value nil
    end_value nil
    value nil
    norm_reference
  end

end
