require 'spec_helper'
require 'support/common_tests'

describe User do

  describe "Common Authorization tests" do

    @verbs = [ 
      { :action => "index",   :name => "get",    :path => "user_root_path",  :render => "show"}
    ]
    
    @roles = [ "caretaker"]
    
    it_should_behave_like "common tests", @verbs, @roles, nil, ""

  end

  describe "GET user_root_path INDEX" do

    context "With user logged in" do

      context "as respondent" do 

        before :each do
          sign_in_as_a_valid_user(:respondent)
          get user_root_path
        end

        it "Gives us the expected status code (REDIRECT)" do
          response.status.should be(302)
        end

        it "Takes us to the responder_items items" do
          expect(response).to redirect_to "/#items"
        end

      end

    end

    context "With user NOT logged in" do

      before :each do
        get user_root_path
      end

      it "Gives us the expected status code (REDIRECT)" do
        response.status.should be(302)
      end

      it "Takes us to the responder_items items" do
        expect(response).to redirect_to new_user_session_path
      end

    end

  end

end