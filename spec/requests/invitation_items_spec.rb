require 'spec_helper'
require 'support/common_tests'

describe ResponderItem do
  
  describe "Common Authorization tests" do

    @verbs = [ 
      { :action => "new",  :name => "get",    :path => "new_invitation_item_path ", :render => "invitation_items/guardian_invitation/index", :format => "json" },
      { :action => "create", :name => "post",   :path => "invitation_items_path", :render => "invitation_items/guardian_invitation/index", :format => "json"},
      { :action => "show", :name => "get",   :path => "invitation_item_path", :render => "invitation_items/guardian_invitation/index", :format => "json"},
      { :action => "update", :name => "put",    :path => "invitation_item_path", :render => "invitation_items/guardian_invitation/index", :format => "json" }
    ]
    
    @roles = [ "guest" , "respondent", "pre_registered" ]

    @responder_item = FactoryGirl.create(:item_with_people)
    
    it_should_behave_like "common tests", @verbs, @roles, @responder_item, "responder_item"

  end


  describe "Specific Tests" do

    context "as a CARETAKER" do

      before :each do
          sign_in_as_a_valid_user(:caretaker)
        end

      describe "GET NEW_INVITATION_ITEM_PATH - NEW" do

        it "Gives us the expected status code (200)" do
          get new_invitation_item_path
          response.status.should be(200)
        end

        it "Renders invitation_items/guardian_invitation/index template" do
          get new_invitation_item_path
          expect(response).to render_template("invitation_items/guardian_invitation/index")
        end
    
      end

      describe "POST INVITATIONS_ITEM_PATH - CREATE" do

        before :each do
          @responder_item = FactoryGirl.attributes_for(:responder_item, :caretaker_id => @user.person_id, :registration_identifier => "respondent_registration")
          post invitation_items_path, responder_item: @responder_item
        end

        it "Gives us the expected status code (200)" do
          
          response.status.should be(200)
        end

        it "Renders invitation_items/guardian_invitation/index template" do
          expect(response).to render_template("invitation_items/guardian_invitation/index")
        end

        it "saves the new Responder Item in the database" do
          expect{ post invitation_items_path, responder_item: @responder_item }.to change(described_class, :count).by(1)
        end

      end

      describe "GET INVITATION_ITEM_PATH - SHOW" do

        before :each do
          @responder_item = FactoryGirl.create(:responder_item, :caretaker_id => @user.person_id, :registration_identifier => "respondent_registration")
          get invitation_item_path(@responder_item.id)
        end

        it "Gives us the expected status code (200)" do
          response.status.should be(200)
        end

        it "Renders invitation_items/guardian_invitation/index template" do
          expect(response).to render_template("invitation_items/guardian_invitation/index")
        end

      end

      describe "PUT INVITATION_ITEM_PATH - UPDATE" do

        before :each do
          @responder_item = FactoryGirl.create(:responder_item, :caretaker_id => @user.person_id, :registration_identifier => "respondent_registration")
          @date = Time.zone.now
          put invitation_item_path(@responder_item.id), responder_item: FactoryGirl.attributes_for(:responder_item, :completed => @date)
        end

        it "Gives us the expected status code (200)" do
          response.status.should be(200)
        end

        it "Renders invitation_items/guardian_invitation/index template" do
          expect(response).to render_template("invitation_items/guardian_invitation/index")
        end

        it "changes RESPONDER_ITEMS attributes" do
          @responder_item.reload
          expect(@responder_item.completed).to eq(@date.to_s)
        end

      end

    end
  end
end