When /^I log in as "([^"]*)" with password "([^"]*)"$/ do |user_email , password|
  unless user_email.blank?
    visit new_user_session_path
    fill_in "user_email", :with => user_email
    fill_in "user_password", :with => password
    click_button I18n.t('actions.sign_in')
  end
end

Then /^I should see correct login information for user "([^"]*)"$/ do |user_email|
  translation = I18n.t('actions.sign_out')
  puts "translation #{translation}"
  within(".login li:nth-child(2) a") do
    if page.respond_to? :should
      page.should have_content(translation)
    end
  end
  within(".login li:nth-child(1) a") do
    if page.respond_to? :should
      page.should have_content(user_email)
    end
  end
end
