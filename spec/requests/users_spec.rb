require 'spec_helper'

describe UsersController do

  describe "GET user_root_path" do

    context "With user logged in" do

      context "as caretaker" do 

        before :each do
          sign_in_as_a_valid_user(:caretaker)
          get user_root_path
        end

        it "Gives us the expected status code" do
          response.status.should be(200)
        end

        it "Takes us to the user list" do
          expect(response).to render_template(:show)
        end

      end

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