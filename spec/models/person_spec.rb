require 'spec_helper'
describe Person do

  context "Age" do 

    it "has correct age" do
      p = Person.create(:dateofbirth => Date.current - 10.year)
      p.age.should == 10
    end

    context "Giving a full cpr" do 

      it "has correct age if was born in the 2000 and his birthday has passed" do
        dateofbirth = Date.current - 13.month
        p = Person.create(:full_cpr => dateofbirth.strftime("%d%m%y")+"3120")
        p.age.should == 1
      end

      it "has correct age if was born in the 1900 and his birthday hasn't passed" do
        dateofbirth = (Date.current - 100.year) + 3.days
        p = Person.create(:full_cpr => dateofbirth.strftime("%d%m%y")+"3129")
        p.age.should == 99
      end

      it "has correct age if was born in the 1900 and his birthday has passed" do
        dateofbirth = (Date.current - 100.year) - 3.days
        p = Person.create(:full_cpr => dateofbirth.strftime("%d%m%y")+"3129")
        p.age.should == 100
      end

    end

  end

end

  # context "creates new person as guardian with invitation" do
  #   before do
  #     @caretaker = FactoryGirl.create(:user, :roles => [FactoryGirl.create(:role, :name => 'caretaker')])
  #     @person = Person.new_as_guardian_by_invitation(@caretaker.person)
  #     @person.save
  #   end

  #   it "should be guardian of a child" do
  #     @person.relationships.should_not be_empty
  #   end

  #   it "child should be a patient" do
  #     @person.relations.should_not be_empty
  #   end

  #   it "has respondent_registration" do
  #     @person.respondent_responder_items.should_not be_empty
  #   end

  #   it "child is patient of" do
  #     @person.respondent_responder_items.should_not be_empty
  #   end

  # end

  # context "person has a role" do
  #   before do
  #     @caretaker = FactoryGirl.create(:user, :roles => [FactoryGirl.create(:role, :name => 'caretaker')])
  #     @respondent = FactoryGirl.create(:user, :roles => [FactoryGirl.create(:role, :name => 'respondent')])
  #     @person = FactoryGirl.create(:person)
  #   end

  #   it "caretaker should be caretaker" do
  #     @caretaker.person.role.should == 'caretaker'
  #   end

  #   it "respondent should be respondent" do
  #     @respondent.person.role.should == 'respondent'
  #   end

  #   it "person with no role should be patient" do
  #     @person.role.should == 'patient'
  #   end

  # end


  # context "Get responder items depending on type, role and status"  do

  #   describe "type and role" do
  #     before do
  #       @registration = FactoryGirl.create(:item_with_people)
  #       @survey = FactoryGirl.create(:survey_item_with_people)
  #       @items = [{:name => :surveys, :item => @survey},{:name => :registrations, :item => @registration}]
  #     end

  #     it "caretaker, patient and respondent have one survey and one registration" do
  #       @items.each do |response|
  #         name = response[:name]
  #         [:caretaker,:subject,:respondent].each do |role|
  #           person = response[:item].send(role)
  #           person.responder_items_by_type_and_status(name).size.should == 1
  #         end
  #       end

  #     end
  #     describe "group items by type(survey/registration) and id" do
  #       before do
  #         @items = []
  #         @subject = FactoryGirl.create(:person)
  #         @caretaker = FactoryGirl.create(:caretaker_person)
  #         @respondent = FactoryGirl.create(:respondent_person)
  #         2.times{|i| @items[i] = FactoryGirl.create(:survey)}
  #         4.times do |i|
  #           FactoryGirl.create(:survey_item_with_people, :survey => @items[i%2], :subject => @subject, :respondent => @respondent, :caretaker => @caretaker)
  #           FactoryGirl.create(:item_with_people, :subject => @subject, :respondent => @respondent, :caretaker => @caretaker)
  #         end
  #       end
  #       it "should have 2 types of surveys" do
  #         @respondent.responder_items_by_group.size.should == 2
  #         @respondent.responder_items_by_group.first[:items].size.should == 2
  #         @respondent.responder_items_by_group.first[:items].size.should == 2
  #         @respondent.responder_items_by_group.first[:items].first.access_code == @items.first.access_code
  #         @respondent.responder_items_by_group.first[:name].should == @items.first.access_code
  #       end
  #     end

  #   end

  #   describe "status" do
  #     before do
  #       @caretaker = FactoryGirl.create(:caretaker_user).person
  #       @status = [:uncompleted, :overdue, :recently_completed]
  #       @status.each do |status|
  #         @caretaker.caretaker_responder_items << FactoryGirl.create("#{status}_registration".to_sym)
  #       end
  #     end

  #     it "has one of each uncompleted, recently_completed, overdue" do
  #       @status.each do |status|
  #         @caretaker.responder_items_by_type_and_status(:registrations,status).size.should == 1
  #       end
  #     end

  #   end

  # end

  # context "delegates user methods" do
  #   before do
  #     @person = FactoryGirl.create(:user, :roles => [FactoryGirl.create(:role, :name => 'caretaker')]).person
  #   end

  #   it "has and email" do
  #     @person.user_email.should_not be_nil
  #   end

  # end

  # context "finders" do
  #   before do
  #     @caretaker = FactoryGirl.create(:user, :roles => [FactoryGirl.create(:role, :name => 'caretaker')])
  #     @respondent = FactoryGirl.create(:user, :roles => [FactoryGirl.create(:role, :name => 'respondent')])
  #     @patient = FactoryGirl.create(:person)
  #     FactoryGirl.create(:patient_relationship, :person => @caretaker.person, :relation => @patient)
  #     FactoryGirl.create(:guardian_relationship, :person => @respondent.person, :relation => @patient)
  #   end

  #   describe "inverse_relation finders" do

  #     it "patient should have a guardian_as_respondent" do
  #       @patient.guardian_respondent.should == @respondent.person
  #     end

  #   end

  # end

