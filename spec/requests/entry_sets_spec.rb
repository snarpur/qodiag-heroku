require 'spec_helper'
require 'support/common_tests'

describe EntrySet do
  
  describe "Common Authorization tests" do

    @verbs = [ 
      { :action => "index",  :name => "get",    :path => "entry_sets_path", :render => "index", :format => "json" },
      { :action => "show",   :name => "get",    :path => "entry_set_path",  :render => "show",  :format => "json" },
      { :action => "create", :name => "post",   :path => "entry_sets_path", :format => "json",  :status_ok => 201 },
      { :action => "update", :name => "put",    :path => "entry_set_path" },
      { :action => "delete", :name => "delete", :path => "entry_set_path",  :format => "json", :status_ok => 204 }
    ]
    
    @roles = [ "guest" , "respondent", "caretaker", "pre_registered" ]

    @entry_set = FactoryGirl.create(:entry_set, :visibility => "1")
    
    it_should_behave_like "common tests", @verbs, @roles, @entry_set, "entry_set"

  end

  
  describe "Specific Tests" do

    describe "PUT ENTRY_SET_PATH - UPDATE" do

      before :each do
        #NOTE: Make the Entry_Set public to test only the authorization     
        @entry_set = FactoryGirl.create(:entry_set, :visibility => "1")
      end
  
      context "as a CARETAKER" do

        it "changes ENTRY_SETS attributes" do
          sign_in_as_a_valid_user(:caretaker)
          put entry_set_path(@entry_set.id), entry_set: FactoryGirl.attributes_for(:entry_set, :name => "YourString", :visibility => "1")
          @entry_set.reload
          expect(@entry_set.name).to eq("YourString")
        end

      end
    end
  end
end