Given /^that an invitation has been sent to (.*@.*\..*)$/ do |email|
  steps %Q{
      Given I am logged in as caretaker
      And I go to the client invitation page
      And I fill in "user_email" with "#{email}"
      And I fill in user details with valid input
      And I click create
  }
end


