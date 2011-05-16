Given /^I have confirmed my invitation as (.*@.*\..*)$/ do |email|
  @last_email = email
  steps %Q{
     Given that an invitation has been sent to #{email}
     Given I am on the confirmation page for #{email}
     When I fill in "user_password" with "secret"
     And I fill in "user_password_confirmation" with "secret"
     And I click register
  }
end
Then /^I should see a uncompleted registration$/ do
  registration = User.find_by_email(@last_email).person.uncompleted_registrations.first
  patient = registration.subject
  within(".uncompleted.registration") do
    page.should have_content("#{patient.firstname} #{patient.lastname}")
  end
end

Then /^I should not see a uncompleted registration$/ do
  page.has_no_selector?(".uncompleted.registration")

end

When /^I have a registration that is overdue$/ do
  KK.see User.find_by_email(@last_email).person.inspect
  registration = User.find_by_email(@last_email).person.registrations(:uncompleted).first
  registration.update_attribute :deadline, Time.zone.now.yesterday
end

Then /^I should see an overdue registration$/ do
  registration = User.find_by_email(@last_email).person.registrations(:uncompleted).first
  patient = registration.subject
  within(".overdue.registration") do
    page.should have_content("#{patient.firstname} #{patient.lastname}")
  end
end

When /^complete a valid client registration$/ do
  fill_in :cpr, :with => 1212
  click_on(I18n.t('actions.save'))
end

