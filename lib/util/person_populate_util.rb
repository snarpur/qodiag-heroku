# encoding: utf-8
require 'faker'
class PersonPopulateUtil

  def initialize
    @caretaker_role = Role.find_by_name('caretaker')
    @respondent_role = Role.find_by_name('respondent')
    @sex = ['male','female']
    @password_params = {:password => "asdfkj", :password_confirmation => "asdfkj"} 
  end

  def random_date(years_back=5)
    year = Time.now.year - years_back
    month = rand(12) + 1
    day = rand(31) + 1
    Time.local(year, month, day)
  end

  def full_cpr(age=5)
    dob = random_date(age).strftime("%d%m%y")
    year = Time.now.year - age
    last = ( year >= 2000 ? "1280" : "1289")
    {:full_cpr => "#{dob}#{last}"}
  end

  def fullname
    pick = rand(2)
    sex = ['male','female'].at(pick)
    suffix = ['sson','sdóttir'].at(pick)
    lastname = "#{Faker::Name.send('male_first_name')}#{suffix}"
    lastname.gsub!(/sss/, 'ss')
    {:firstname => Faker::Name.send("#{sex}_first_name"), :lastname => lastname, :sex => sex}
  end

  def person_attributes(age)
    name = fullname()
    cpr = full_cpr(age)
    name.merge(cpr)
  end

  def create_caretaker(name)
    attrs = person_attributes(rand(10)+40)
    attrs[:genavatar] = true
    attrs[:type] = "caretaker"
    caretaker_person = FactoryGirl.create(:person, attrs)
    caretaker_user = FactoryGirl.create(:user, 
                                    :email => "#{name}@qodiag.com", 
                                    :roles => [@caretaker_role], 
                                    :person => caretaker_person
                                   )
    {:person => caretaker_person, :user => caretaker_user}
  
  end

  def create_patient(caretaker_person)
    attrs = person_attributes(rand(10)+5)
    attrs[:genavatar] = true
    attrs[:type] = "patient"
    patient = FactoryGirl.create(:person, attrs)
    FactoryGirl.create(:patient_relationship, :person => caretaker_person, :relation => patient)
    patient
  end

  def create_parent(patient)
    attrs = person_attributes(rand(20)+40)
    attrs[:genavatar] = true
    attrs[:type] = "parent"
    parent_person = FactoryGirl.create(:person, attrs)
    parent_user = FactoryGirl.create(:user,  
                                 :email => "user_#{parent_person.id}_#{rand(10)}@qodiag.com", 
                                 :roles => [@respondent_role], 
                                 :person => parent_person
                                )
    FactoryGirl.create(:guardian_relationship, :person => parent_person, :relation => patient)
    FactoryGirl.create(:parent_relationship, :person => parent_person, :relation => patient)
    FactoryGirl.create(:respondent_relationship, :person => parent_person, :relation => patient)
    {:person => parent_person, :user => parent_user}
  
  end

end