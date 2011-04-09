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

  describe "POST create" do
    login_user(:caretaker)
    before do
     post :create, :user => {:email => "email@example.com", :role_ids => "3", :person_attributes => {:firstname => "Jimmy", :lastname => "Bean"}}
    end
    it "invited user should recieve and email" do
      ActionMailer::Base.delivery_method = :test
      ActionMailer::Base.perform_deliveries = true
      ActionMailer::Base.deliveries.clear
      @email = ActionMailer::Base.deliveries.first
      KK.see @email.to
      @email.to.should include("email@example.com")

    end
  end

  describe "GET edit and PUT update" do
    login_user(:caretaker)

    before do
      post :create, :user => {
          :email => "email@example.com", :role_ids => "3",
          :person_attributes => {
              :firstname => "Jimmy",
              :lastname => "Bean"
            }
          }
      @new_user = User.find_by_email("email@example.com")
    end

    it "invited user should be routed to confirmation page" do
      get :edit, :invitation_token => @new_user.invitation_token
      response.should be_success
    end

    context "invalid invitation token" do
      before do
        get :edit, :invitation_token => @new_user.invitation_token << "df"
      end
      it { response.status.should eql(302) }
      it { response.should redirect_to root_path }
      it { flash[:alert].should eql I18n.t('devise.invitations.invitation_token_invalid') }
    end

    context "confirm by updating password" do
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

