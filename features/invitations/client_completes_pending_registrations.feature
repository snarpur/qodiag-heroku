Feature: Ensure that a user has completed the registration process
  As a user
  I want to complete registration
  So that I can use the system

Background:
  Given I have confirmed my invitation as kalli@kalli.is

Scenario: See the if the registration is pending
          Then show me the page
          Then I should see a pending registration

# Scenario: Finnish the registration
#
# Scenario: Save and finnish the registration later

