require 'spec_helper'
require 'support/common_tests'

describe Person do
  
  describe "Common Authorization tests" do

    @verbs = [ 
      { :action => "show",   :name => "get",    :path => "person_path", :format => "json" },
      { :action => "create", :name => "post",   :path => "people_path", :format => "json"},
      { :action => "update", :name => "put",    :path => "person_path", :format => "json", :status_ok => 204 }
    ]
    
    @roles = [ "guest", "pre_registered" , "caretaker"]

    @person = FactoryGirl.create(:person)
    
    it_should_behave_like "common tests", @verbs, @roles, @person, "person"

  end

  describe "Specific Authorization tests" do


    describe "GET IMAGE_UPLOAD_PATH - IMAGE_UPLOAD" do

      before :each do
        @person = FactoryGirl.create(:person)
      end

      context "as a GUEST" do

        it "Renders Error 401 login page" do
          put image_upload_path(@person.id)
          expect(response).to render_template("pages/error_401_login")
        end
      
        it "Gives us the expected status code 401" do
          put image_upload_path(@person.id)
          response.status.should be(401)
        end

      end

      context "as a PRE_REGISTERED" do

        before :each do
          sign_in_as_a_valid_user(:pre_registered)
        end

        it "Renders Error 401 login page" do
          put image_upload_path(@person.id)
          expect(response).to render_template("pages/error_401")
        end
      
        it "Gives us the expected status code 401" do
          put image_upload_path(@person.id)
          response.status.should be(401)
        end
        
      end

      context "as a CARETAKER" do

        before :each do
          sign_in_as_a_valid_user(:caretaker)
          put image_upload_path(@person.id), redirect_path: "/profile/"+@user.id.to_s
        end

        it "Gives us the expected status code 302 when passes the redirect URL" do
          response.status.should be(302)
        end
        
      end

      context "as a RESPONDENT" do

        before :each do
          sign_in_as_a_valid_user(:respondent)
          @person = FactoryGirl.create(:person)
        end

        context "The respondent is NOT the guardian of the subject" do

          before :each do
            FactoryGirl.create(:guardian_relationship, :relation => @person)
            put image_upload_path(@person.id), redirect_path: "/profile/"+@person.id.to_s
          end

          it "Gives us the expected status code 401" do
            response.status.should be(401)
          end

          it "Renders Error 401 page" do
            expect(response).to render_template("pages/error_401")
          end

        end

        context "The respondent is the guardian of the subject" do

          before :each do
            FactoryGirl.create(:guardian_relationship, :person => @user.person, :relation => @person)
            put image_upload_path(@person.id), redirect_path: "/profile/"+@person.id.to_s
          end

           it "Gives us the expected status code 302 when passes the redirect URL" do
            response.status.should be(302)
          end

        end

      end

    end

  end

  describe "Specific Respondent tests" do

    before :each do
      sign_in_as_a_valid_user(:respondent)
      @person = FactoryGirl.create(:person)      
    end

    describe "GET PERSON_PATH - SHOW" do

      context "The respondent is NOT the guardian of the subject" do

        before :each do
          FactoryGirl.create(:guardian_relationship, :relation => @person)
        end

        it "Gives us the expected status code 401" do
          get person_path(@person.id)
          response.status.should be(401)
        end

        it "Renders Error 401 page" do
          get person_path(@person.id)
          expect(response).to render_template("pages/error_401")
        end

      end

      context "The respondent is the guardian of the subject" do

        before :each do
          FactoryGirl.create(:guardian_relationship, :person => @user.person, :relation => @person)
          get person_path(@person.id)
        end

        it "Gives us the expected status code 200" do
          response.status.should be(200)
        end

        it "Renders SHOW Template" do
          expect(response).to render_template(:show)
        end

      end

    end

    describe "POST PERSON_PATH - CREATE" do

      before :each do
        FactoryGirl.create(:guardian_relationship, :person => @user.person, :relation => @person)
        post people_path
      end

      it "Gives us the expected status code 401" do
        response.status.should be(401)
      end

      it "Renders Error 401 page" do
        expect(response).to render_template("pages/error_401")
      end

    end

    describe "PUT PERSON_PATH - UPDATE" do

      context "The respondent is NOT the guardian of the subject" do

        before :each do
          FactoryGirl.create(:guardian_relationship, :relation => @person)
          put person_path(@person.id), person: FactoryGirl.attributes_for(:person, :name => "Ataman")
        end

        it "Gives us the expected status code 401" do
          response.status.should be(401)
        end

        it "Renders Error 401 page" do
          expect(response).to render_template("pages/error_401")
        end

      end

      context "The respondent is the guardian of the subject" do

        before :each do
          FactoryGirl.create(:guardian_relationship, :person => @user.person, :relation => @person)
          put person_path(@person.id), person: FactoryGirl.attributes_for(:person, :firstname => "Ataman")
        end

        it "Gives us the expected status code 406 (NOT ACCEPTABLE)" do
          response.status.should be(406)
        end

        it "changes PERSON attributes" do
          @person.reload
          expect(@person.firstname).to eq("Ataman")
        end

      end

    end

  end

  describe "Specific CARETAKER tests" do

    describe "PUT PERSON_PATH - UPDATE" do

      before :each do
        sign_in_as_a_valid_user(:caretaker)
        @person = FactoryGirl.create(:person)      
        put person_path(@person.id), person: FactoryGirl.attributes_for(:person, :firstname => "Ataman")
      end

      it "changes PERSON attributes" do
        @person.reload
        expect(@person.firstname).to eq("Ataman")
      end

    end

  end

end