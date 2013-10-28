require 'spec_helper'
require 'support/common_tests'

describe NationalRegister do

  describe "Specific Tests" do

    describe "GET NATIONAL_REGISTER_PATH - SHOW" do

      before :each do   
        @responder_item = FactoryGirl.create(:national_register)
      end
  
      context "as a GUEST" do

        before :each do   
          get lookup_path kennitala: @responder_item.kennitala
        end

        it "Gives us the expected status code 200" do
          response.status.should be(401)
        end

        it "Renders Error 401 login page" do
          expect(response).to render_template("pages/error_401_login")
        end

      end

      context "as a PRE_REGISTERED" do

        before :each do 
          sign_in_as_a_valid_user(:pre_registered)  
          get lookup_path kennitala: @responder_item.kennitala
        end

        it "Gives us the expected status code 400" do
          response.status.should be(401)
        end

        it "Renders Error 401 login page" do
          expect(response).to render_template("pages/error_401")
        end

      end

      context "as a RESPONDENT" do

        before :each do 
          sign_in_as_a_valid_user(:respondent)  
          get lookup_path kennitala: @responder_item.kennitala
        end

        it "Gives us the expected status code 200" do
          response.status.should be(200)
        end

        it "Renders LOOKUP template" do
          expect(response).to render_template(:lookup)
        end

      end

      context "as a CARETAKER" do

        before :each do 
          sign_in_as_a_valid_user(:caretaker)  
          get lookup_path kennitala: @responder_item.kennitala
        end

        it "Gives us the expected status code 200" do
          response.status.should be(200)
        end

        it "Renders LOOKUP template" do
          expect(response).to render_template(:lookup)
        end

      end

    end
  end
end