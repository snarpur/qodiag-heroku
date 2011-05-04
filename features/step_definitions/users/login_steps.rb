When /^I log in as "([^"]*)" with password "([^"]*)"$/ do |user_email , password|
  unless user_email.blank?
    visit path_to('sign in page')
    fill_in "user_email", :with => user_email
    fill_in "user_password", :with => password
    click_button I18n.t('actions.sign_in')
  end
end

Given /^I(?: am (.*) and I)? am logged in as (.*)$/ do |name ,role|
  password = "secret"
  name = name.blank? ? "kennedy" : name
  user = Factory(:user, :email => "#{name}@somedomain.com", :password => password, :password_confirmation => password, :roles => [Factory(:role,:name=> role)])
  visit path_to('sign in page')
  fill_in "user_email", :with => "#{name}@somedomain.com"
  fill_in "user_password", :with => password
  click_button I18n.t('actions.sign_in')
end

Then /^I should see correct login information for user "([^"]*)"$/ do |user_email|
  translation = I18n.t('actions.sign_out')
  within(".login li:nth-child(2) a") do
      page.should have_content(translation)
  end
  within(".login li:nth-child(1) a") do
      page.should have_content(user_email)
  end
end

Then /^I sign out/ do
    click_link(I18n.t('actions.sign_out'))
end