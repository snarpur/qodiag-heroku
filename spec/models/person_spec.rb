require 'spec_helper'
describe Person do
  it "has corrent age" do
    p = Person.create(:dateofbirth => Date.current - 10.year)
    p.age.should == 10
  end
  context "creates new person as guardian with invitation" do
    before do
      @caretaker = Factory(:user, :roles => [Factory(:role, :name => 'caretaker')])
      @person = Person.new_as_guardian_by_invitation(@caretaker.person)
      @person.save
    end

    it "should be guardian of a child" do
      @person.relationships.should_not be_empty
    end

    it "child should be a patient" do
      @person.relations.should_not be_empty
    end

    it "has client_registration" do
      @person.client_responder_items.should_not be_empty
    end

    it "child is patient of" do
      @person.client_responder_items.should_not be_empty
    end

  end

  context "person has a role" do
    before do
      @caretaker = Factory(:user, :roles => [Factory(:role, :name => 'caretaker')])
      @client = Factory(:user, :roles => [Factory(:role, :name => 'client')])
      @person = Factory(:person)
    end

    it "caretaker should be caretaker" do
      @caretaker.person.role.should == 'caretaker'
    end

    it "client should be client" do
      @client.person.role.should == 'client'
    end

    it "person with no role should be patient" do
      @person.role.should == 'patient'
    end

  end


  context "Get responder items depending on type, role and status"  do

    describe "type and role" do
      before do
        @registration = Factory(:item_with_people)
        @survey = Factory(:survey_item_with_people)
        @items = [{:name => :surveys, :item => @survey},{:name => :registrations, :item => @registration}]
      end

      it "caretaker, patient and client have one survey and one registration" do
        @items.each do |response|
          name = response[:name]
          [:caretaker,:subject,:client].each do |role|
            person = response[:item].send(role)
            person.responder_items_by_type_and_status(name).size.should == 1
          end
        end

      end
      describe "group items by type(survey/registration) and id", :focus => true do
        before do
          @items = []
          @subject = Factory(:person)
          @caretaker = Factory(:caretaker_person)
          @client = Factory(:client_person)
          2.times{|i| @items[i] = Factory(:survey)}
          4.times do |i|
            Factory(:survey_item_with_people, :survey => @items[i%2], :subject => @subject, :client => @client, :caretaker => @caretaker)
            Factory(:item_with_people, :subject => @subject, :client => @client, :caretaker => @caretaker)
          end
        end
        it "should have 2 types of surveys" do
          @client.responder_items_by_group.size.should == 2
          @client.responder_items_by_group.first[:items].size.should == 2
          @client.responder_items_by_group.first[:items].size.should == 2
          @client.responder_items_by_group.first[:items].first.access_code == @items.first.access_code
          @client.responder_items_by_group.first[:name].should == @items.first.access_code
        end
      end

    end

    describe "status" do
      before do
        @caretaker = Factory(:caretaker_user).person
        @status = [:uncompleted, :overdue, :recently_completed]
        @status.each do |status|
          @caretaker.caretaker_responder_items << Factory("#{status}_registration".to_sym)
        end
      end

      it "has one of each uncompleted, recently_completed, overdue" do
        @status.each do |status|
          @caretaker.responder_items_by_type_and_status(:registrations,status).size.should == 1
        end
      end

    end

  end

  context "delegates user methods" do
    before do
      @person = Factory(:user, :roles => [Factory(:role, :name => 'caretaker')]).person
    end

    it "has and email" do
      @person.user_email.should_not be_nil
    end

  end

  context "finders" do
    before do
      @caretaker = Factory(:user, :roles => [Factory(:role, :name => 'caretaker')])
      @client = Factory(:user, :roles => [Factory(:role, :name => 'client')])
      @patient = Factory(:person)
      Factory(:patient_relationship, :person => @caretaker.person, :relation => @patient)
      Factory(:guardian_relationship, :person => @client.person, :relation => @patient)
    end

    describe "inverse_relation finders" do

      it "patient should have a guardian_as_client" do
        @patient.guardian_client.should == @client.person
      end

    end

  end

end
