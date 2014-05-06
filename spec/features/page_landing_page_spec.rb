require 'spec_helper'

describe "PagesLandingPage" do

  context "With User NOT logged in" do
    it "displays login link" do
      visit root_path
      page.should have_content(I18n.t('actions.log_in'))
    end

    it "displays sign up link" do
      visit root_path
      page.should have_content(I18n.t('actions.register'))
    end

  end

  describe "Sign up Logic" do

    before {load_roles()}
    
    it "displays an error when email field is empty" do
      visit root_path
      click_button I18n.t('actions.register')
      page.should have_content(I18n.t("devise.registrations.blank_email"))
    end

    it "displays an error when email is invalid" do
      visit root_path
      fill_in 'user_email', :with => 'not-valid-email'
      click_button I18n.t('actions.register')
      page.should have_content(I18n.t("activerecord.errors.messages.invalid"))
    end

    it "displays an error if the email exists" do
      # It doesn't matter the new user's role
      user = FactoryGirl.create(:user, :roles => [FactoryGirl.create(:role, :name => 'caretaker')])
      visit root_path
      fill_in 'user_email', :with => user.email
      click_button I18n.t('actions.register')
      page.should have_content(I18n.t('activerecord.errors.messages.taken'))
    end

    context "The sign up process goes well"
      
      before :each do
        @not_used_email = "email.not.used@qodiag.com"
        visit root_path
        fill_in 'user_email', :with => @not_used_email
        click_button I18n.t('actions.register') 
      end

      it "shows a successful message" do 
        page.should have_content(I18n.t('devise.registrations.pre_registration',:email => @not_used_email))
      end

      it "interested person receives an email" do 
        ActionMailer::Base.delivery_method = :test
        ActionMailer::Base.perform_deliveries = true
        @email = ActionMailer::Base.deliveries.first
        @email.to.should include(@not_used_email)
      end

  end


  context "With User logged in" do
    #NOTE: We should also test more things depending on the user role. But not in this file!
  
    it "for caretakers display logout link" do
      #user_manually_sign_in()
      user_sign_in(:caretaker)
      visit root_path
      page.should have_content(I18n.t('actions.sign_out'))
    end

    it "for respondent display logout link" do
      user_sign_in(:respondent)
      visit root_path
      page.should have_content(I18n.t('actions.sign_out'))
    end

  end

end