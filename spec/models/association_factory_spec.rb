require 'spec_helper'

describe AssociationFactory do
  before(:each) do
    @caretaker = Factory(:user, :roles => [Factory(:role, :name => "caretaker")], :person => Factory(:person) )
    @parent_user = Factory.build(:user, :roles => [Factory.build(:role ,:name => "client")], :person => Factory.build(:person) )
  end

  context "new parent invitation factory" do
    before(:each) do
      @item = AssociationFactory.new(:client_as_parent_invitation,
                              { :user => @parent_user,
                                :current_user => @caretaker }).items
      KK.see @item[:child].inverse_relationships
    end

    it "have a caretaker" do
      @item[:caretaker].should eql @caretaker
    end
    it "parent should have a person" do
      @item[:parent].person.should eql @parent_user.person
    end
    it "parent should have a client role" do
      @item[:parent].roles.collect {|i| i[:name]}.should include("client")
    end
    it "parent should have a child relation" do
      @item[:parent].person.relations.first.should eql @item[:child]
    end

    it "child should be patient of current user" do
      @item[:child].inverse_relationships.collect {|i| i[:name] == "patent" && i[:person_id] == @item[:caretaker].person.id}.should be_true
    end
  end
end
