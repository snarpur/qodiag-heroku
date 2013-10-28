require 'spec_helper'
require 'support/common_tests'
require 'factory_girl_helper'

describe ResponderItem do
  
  describe "Common Authorization tests" do

    @verbs = [ 
      { :action => "create", :name => "post",   :path => "responder_items_path", :render => "create", :format => "json"}
    ]
    
    @roles = [ "guest" , "respondent", "pre_registered"]

    @responder_item = FactoryGirl.create(:item_with_people)
    
    it_should_behave_like "common tests", @verbs, @roles, @responder_item, "responder_item"

  end

  describe "Specific tests" do

    describe "POST RESPONDER_ITEMS_PATH - CREATE" do

      context "as a CARETAKER" do

        before :all do
          sign_in_as_a_valid_user(:caretaker) 
        end

        it "Gives us the expected status code 200" do
          post responder_items_path, :responder_item => build_attributes(:item_with_people), :format => "json"
          response.status.should be(200)
        end

        it "Renders CREATE template" do
          post responder_items_path, :responder_item => build_attributes(:item_with_people), :format => "json"
          expect(response).to render_template("create")
        end

        it "saves the new RESPONDER_ITEM in the database" do
          expect{ post responder_items_path, :responder_item => build_attributes(:item_with_people), 
            :format => "json" }.to change(ResponderItem, :count).by(1)
        end

        it "sends the email" do 
          ActionMailer::Base.deliveries.clear 
          post responder_items_path, :responder_item => params_for(:item_with_people), :format => "json"
          ActionMailer::Base.delivery_method = :test
          ActionMailer::Base.perform_deliveries = true
          ActionMailer::Base.deliveries.count.should == 1
        end

      end

    end

    describe "GET ALL_SURVEYS_PATH - SURVEY" do

      context "as a GUEST" do

        before :each do
          @responder_item_survey = FactoryGirl.create(:survey_item_with_people)
          get "/people/#{@responder_item_survey.subject_id}/responder_items/survey/#{@responder_item_survey.survey_id}",
              :format => "json"
        end

        it "Gives us the expected status code 401" do
          response.status.should be(401)
        end

        it "Renders Error 401 login page" do
          expect(response).to render_template("pages/error_401_login")
        end

      end

      context "as a PRE_REGISTERED" do

        before :each do
          @responder_item_survey = FactoryGirl.create(:survey_item_with_people)
          sign_in_as_a_valid_user(:pre_registered)
          get "/people/#{@responder_item_survey.subject_id}/responder_items/survey/#{@responder_item_survey.survey_id}",
              :format => "json"
        end

        it "Gives us the expected status code 401" do
          response.status.should be(401)
        end

        it "Renders Error 401 page" do
          expect(response).to render_template("pages/error_401")
        end

      end

      context "as a RESPONDENT" do

        before :each do
          sign_in_as_a_valid_user(:respondent)          
        end

        context " NOT the SUBJECT'S RESPONDENT" do

          before :each do
            @responder_item_survey = FactoryGirl.create(:survey_item_with_people)
            get "/people/#{@responder_item_survey.subject_id}/responder_items/survey/#{@responder_item_survey.survey_id}", :format => "json"
          end

          it "Gives us the expected status code 401" do
            response.status.should be(401)
          end

          it "Renders Error 401 page" do
            expect(response).to render_template("pages/error_401")
          end

        end

        context "the SUBJECT'S RESPONDENT" do

          before :each do

            @responder_item_survey = FactoryGirl.create(:survey_item_with_people, :respondent => @user.person)
            FactoryGirl.create(:survey_item, 
              :caretaker_id => @responder_item_survey.caretaker_id, 
              :subject_id => @responder_item_survey.subject_id, 
              :respondent_id => @user.person_id,
              :survey_id => @responder_item_survey.survey_id)

            get "/people/#{@responder_item_survey.subject_id}/responder_items/survey/#{@responder_item_survey.survey_id}", :format => "json"
          end

          it "Gives us the expected status code 200" do
            response.status.should be(200)
          end

          it "Renders survey template" do
            expect(response).to render_template("survey")
          end

        end

        context "NO RESPONDER ITEMS" do

          before :each do

            @survey = FactoryGirl.create(:survey_item_with_people)
            @person = FactoryGirl.create(:person)
            
            get "/people/#{@person.id}/responder_items/survey/#{@survey.survey_id}", :format => "json"
          end

          it "Gives us the expected status code 401" do
            response.status.should be(401)
          end

          it "Renders Error 401 page" do
            expect(response).to render_template("pages/error_401")
          end

        end

      end

      context "as a CARETAKER" do

        before :each do
          sign_in_as_a_valid_user(:caretaker)          
        end

        context " NOT the CARETAKERS'S RESPONDENT" do

          before :each do
            @responder_item_survey = FactoryGirl.create(:survey_item_with_people)
            get "/people/#{@responder_item_survey.subject_id}/responder_items/survey/#{@responder_item_survey.survey_id}", :format => "json"
          end

          it "Gives us the expected status code 401" do
            response.status.should be(401)
          end

          it "Renders Error 401 page" do
            expect(response).to render_template("pages/error_401")
          end

        end

        context "the CARETAKERS'S RESPONDENT" do

          before :each do

            @responder_item_survey = FactoryGirl.create(:survey_item_with_people, :caretaker => @user.person)
            FactoryGirl.create(:survey_item, 
              :caretaker_id => @responder_item_survey.caretaker_id, 
              :subject_id => @responder_item_survey.subject_id, 
              :respondent_id => @user.person_id,
              :survey_id => @responder_item_survey.survey_id)

            get "/people/#{@responder_item_survey.subject_id}/responder_items/survey/#{@responder_item_survey.survey_id}", :format => "json"
          end

          it "Gives us the expected status code 200" do
            response.status.should be(200)
          end

          it "Renders survey template" do
            expect(response).to render_template("survey")
          end

        end

        context "NO RESPONDER ITEMS" do

          before :each do

            @survey = FactoryGirl.create(:survey_item_with_people)
            @person = FactoryGirl.create(:person)
            
            get "/people/#{@person.id}/responder_items/survey/#{@survey.survey_id}", :format => "json"
          end

          it "Gives us the expected status code 200" do
            response.status.should be(200)
          end

          it "Renders survey template" do
            expect(response).to render_template("survey")
          end

        end

      end

    end

  end

end