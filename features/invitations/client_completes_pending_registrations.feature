Feature: Ensure that a user has completed the registration process
  As a user
  I want to complete registration
  So that I can use the system

Background:
  Given I have confirmed my invitation as kalli@kalli.is

Scenario: See the if the registration is pending
  Then I should see a uncompleted registration

Scenario: Finnish the registration
    When I click finish
    And complete a valid client registration
    Then I should not see a uncompleted registration

Scenario: I have an overdue uncompleted registration
  When I have a registration that is overdue
  And I go to the users page
  Then I should see an overdue registration



