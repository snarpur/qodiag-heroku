require 'spec_helper'
describe Person do

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
    #
    it "has client_registration" do
      @person.client_responder_items.should_not be_empty
    end

    it "child is patient of" do
      @person.client_responder_items.should_not be_empty
    end

  end


end