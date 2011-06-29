Feature: Invite new clients
      As a specialist
      I want to invite clients
      So I can improve their treatment

Background:
  Given the following users exists:
   | email        | user_roles   |
   | jim@mail.com | name: client |
  And I am logged in as caretaker
  And I am on the client invitation page

Scenario: Invite new client user
  When I fill in "user_email" with "kalli@nonni.is"
  And I fill in user details with valid input
  And I click create
  Then I should see the send_instructions invitation message




