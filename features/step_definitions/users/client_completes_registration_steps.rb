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


Then /^I should see a pending registration$/ do
  registration = User.find_by_email(@last_email).person.uncompleted_registrations.first
  patient = registration.subject
  within(".pending_registration") do
    page.should have_content("#{patient.firstname} #{patient.lastname}")
  end
end

Then /^I should not see a pending registration$/ do
  page.has_no_selector?(".pending_registration")

end

When /^complete a valid client registration$/ do
  fill_in :cpr, :with => 1212
  click_on(I18n.t('actions.save'))
end

