require 'spec_helper'

describe Devise::InvitationsController do
  describe "GET new" do
    context "When the super_admin is loged in" do
      login_user(:super_admin)

      it "should display the caretaker invitation page" do
        get :new, :role_ids => "2"
        response.should be_success
      end

    end

    context "When the caretaker is loged in" do
      login_user(:caretaker)

      it "should not display the caretaker invitation page" do
        get :new, :role_ids => "2"
        response.status.should eql(401)
      end

      it "should display the client invitation page" do
        get :new, :role_ids => "3"
        response.should be_success
      end
    end
  end


  describe "Invitations" do
    login_user(:caretaker)

    before do
      ActionMailer::Base.deliveries.clear
      post :create, :user => {
          :email => "email@example.com", :role_ids => "3",
          :person_attributes => {
              :firstname => "Jimmy",
              :lastname => "Bean"
            }
          }
      @new_user = User.find_by_email("email@example.com")

    end

    context "POST create" do
      it "invited user should recieve email" do
        ActionMailer::Base.delivery_method = :test
        ActionMailer::Base.perform_deliveries = true
        @email = ActionMailer::Base.deliveries.first
        @email.to.should include("email@example.com")
      end


    end

    context "GET edit" do

      it "invited user should be routed to confirmation page" do
        get :edit, :invitation_token => @new_user.invitation_token
        response.should be_success
      end

      it "invalid invitation token" do
        get :edit, :invitation_token => @new_user.invitation_token << "df"
        response.status.should eql(302)
        response.should redirect_to root_path
        flash[:alert].should eql I18n.t('devise.invitations.invitation_token_invalid')
      end
    end

    context "POST update" do
      before do
        put :update, :user => {
          "password" => "verysecret",
          "password_confirmation" => "verysecret",
          "invitation_token" => @new_user.invitation_token
          }
      end
      it { response.should redirect_to root_path }
      it { flash[:notice].should eql I18n.t('devise.invitations.updated') }
    end
   end
end

