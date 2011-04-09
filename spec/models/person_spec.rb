require 'spec_helper'
describe Person do
  context "child with one relation as guardiand and parend" do
    before do
      @parent = Person.create(:firstname  => "Mom")
      @child  = Person.create(:firstname => "Child",
                                :factory    => {
                                  :name     => :parent_and_guardian,
                                  :relation => @parent
                                })
    end

    it "have the correct parent" do
        @child.inverse_relations.parents.should include(@parent)
    end
    it "have only one parent" do
        @child.inverse_relations.parents.should have_exactly(1).items
    end
  end

  context "child should be a patient of a specialist" do
     before do
       @specialist = Person.create(:firstname  => "specialist")
       @child      = Person.create(:firstname  => "Child",
                                     :factory    => {
                                       :name     => :patient,
                                       :relation => @specialist
                                    })
     end
     it "child should have one specialist" do
       @child.inverse_relations.specialists.should include(@specialist)
     end
    it "have only one specialist" do
        @child.inverse_relations.specialists.should have_exactly(1).items
    end


   end
end