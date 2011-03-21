When /^I log in as "([^"]*)" with password "([^"]*)"$/ do |user_email , password|
  unless user_email.blank?
    visit new_user_session_path
    fill_in "user_email", :with => user_email
    fill_in "user_password", :with => password
    click_button I18n.t('actions.sign_in')
  end
end

