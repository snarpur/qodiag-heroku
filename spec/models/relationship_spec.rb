require 'spec_helper'

describe Relationship do
  it "2 selected" do
    relationship = Relationship.create(:name => ["parent","","guardian",""], :person_id => 1, :relation_id => 2)
    copy  = Relationship.where("person_id = ? AND relation_id = ?", relationship.person_id, relationship.relation_id).last
    relationship.name.should eql "guardian"
    copy.name.should eql "parent"

  end
  it "1 selected" do
    relationship = Relationship.create(:name => ["parent","","",""], :person_id => 1, :relation_id => 2)
    relationship.name.should eql "parent"
  end

  it "0 selected" do
    relationship = Relationship.create(:name => ["","",""], :person_id => 1, :relation_id => 2)
    relationship.should be_invalid
  end
end
