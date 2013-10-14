require 'spec_helper'

describe "SignInPage" do

  describe "When we are signing in"

  before {visit new_user_session_path}

  context "Incorrect or empty data" do

    it "displays an error when email and password are empty" do
      fill_in 'user_email', :with => ''
      fill_in 'user_password', :with => ''
      click_button I18n.t('actions.sign_in')
      page.should have_content(I18n.t('devise.failure.invalid'))
    end

    it "displays an error when email is empty" do
      fill_in 'user_email', :with => ''
      fill_in 'user_password', :with => 'asdfkj'
      click_button I18n.t('actions.sign_in')
      page.should have_content(I18n.t('devise.failure.invalid'))
    end

    it "displays an error when password is empty" do
      fill_in 'user_email', :with => 'one-mail@qodiag.com'
      fill_in 'user_password', :with => ''
      click_button I18n.t('actions.sign_in')
      page.should have_content(I18n.t('devise.failure.invalid'))
    end

    it "displays an error when password or email are incorrect" do
      fill_in 'user_email', :with => 'correct.email@qodiag.com'
      fill_in 'user_password', :with => 'asdfkj'
      click_button I18n.t('actions.sign_in')
      page.should have_content(I18n.t('devise.failure.invalid'))
    end

  end

  context "Correct data" do

    before :each do
      #NOTE: It doesn't matter the user role
      @current_user = FactoryGirl.create(:user, :roles => [FactoryGirl.create(:role, :name => "caretaker")])
      fill_in 'user_email', :with => @current_user.email
      fill_in 'user_password', :with => 'asdfkj'
      click_button I18n.t('actions.sign_in')
    end

    it "displays a successful message" do
      page.should have_content(I18n.t('devise.sessions.signed_in'))
    end

    it "displays the sign out link" do
      page.should have_content(I18n.t('devise.sessions.sign_out'))
    end

  end

  context "Logged in" do

    before :each do
      #NOTE: It doesn't matter the user role
      user_sign_in(:respondent)
      visit root_path
      click_link I18n.t('devise.sessions.sign_out')
    end


    it "displays the sign out message" do
      page.should have_content(I18n.t('devise.sessions.signed_out'))
    end

    it "takes us to the login page" do
      current_path.should == new_user_session_path
    end

  end

end