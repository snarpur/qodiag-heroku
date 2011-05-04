Given /^I have confirmed my invitation as (.*@.*\..*)$/ do |email|
  steps %Q{
     Given that an invitation has been sent to #{email}
     Given I am on the confirmation page for #{email}
     When I fill in "user_password" with "secret"
     And I fill in "user_password_confirmation" with "secret"
     And I click register
  }
end