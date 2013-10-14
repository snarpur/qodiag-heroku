require 'spec_helper'
include Warden::Test::Helpers
Warden.test_mode!

module Features

  module SessionHelpers

    def user_sign_in(role)
      @current_user = FactoryGirl.create(:user, :roles => [FactoryGirl.create(:role, :name => role.to_s)])
      login_as(@current_user, scope: :user)
    end

    def user_manually_sign_in
      visit new_user_session_path
      @current_user = FactoryGirl.create(:user, :roles => [FactoryGirl.create(:role, :name => role.to_s)])
      fill_in 'user_email', :with => 'ataman@qodiag.com'
      fill_in 'user_password', :with => 'asdfkj'
      click_button I18n.t('actions.sign_in')
    end

    def load_roles
      roles = ["super_admin", "caretaker", "respondent", "pre_registered"]
      roles.each do |role| 
        FactoryGirl.create(:role, :name => role.to_s)
      end
    end


  end
end