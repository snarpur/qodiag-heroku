Given /^I have confirmed my invitation as (.*@.*\..*)$/ do |email|
  set_assigned(:last_mail, email)
  steps %Q{
     Given that an invitation has been sent to #{email}
     Given I am on the confirmation page for #{email}
     When I fill in "user_password" with "secret"
     And I fill in "user_password_confirmation" with "secret"
     And I click register
  }
  set_assigned(:user, User.find_by_email(email))
end

Then /^I should see a uncompleted registration$/ do
  registration = ResponderItem.uncompleted.where(:client_id => get_assigned(:user).person.id).first

  patient = registration.subject
  within(".uncompleted .registration") do
    page.should have_content(I18n.t("responder_item.#{registration.item_type}_items.#{registration.access_code}"))
  end
end

Then /^I should not see a uncompleted registration$/ do
  page.has_no_selector?(".uncompleted .registration")

end

When /^I have a registration that is overdue$/ do
  item = get_assigned(:user).person.client_responder_items.first
  item.update_attribute(:deadline, 2.days.ago)
end

Then /^I should see an overdue registration$/ do
  registration = ResponderItem.overdue.where(:client_id => get_assigned(:user).person.id).first
  patient = registration.subject
  within(".overdue .registration") do
    page.should have_content(I18n.t("responder_item.#{registration.item_type}_items.#{registration.access_code}"))
  end
end

When /^complete a valid client registration$/ do
  fill_in :cpr, :with => '1212'
  click_on(I18n.t('actions.save'))
end

