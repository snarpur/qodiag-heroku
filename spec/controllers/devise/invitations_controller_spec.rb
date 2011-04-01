require 'spec_helper'

describe Devise::InvitationsController do
  describe "GET new" do
      before do
        Factory(:role, :name => "caretaker")
        Factory(:role, :name => "client")
      end

    context "When the super_admin is loged in" do
      login_user(:super_admin)

      it "should display the caretaker invitation page" do
        get :new, :role_name => "caretaker"
        response.should be_success
      end

    end

    context "When the caretaker is loged in" do
      login_user(:caretaker)

      it "should not display the caretaker invitation page" do
        get :new, :role_name => "caretaker"
        response.should render_template('shared/error_pages/401')
      end
      it "should not display the client invitation page" do
        get :new, :role_name => "client"
        response.should be_success
      end
    end
  end
end