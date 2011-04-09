@confirm_user_invitation
Feature: Confirm user invitation
         As an Invited user
         I want to confirm my invitation
         So that I can login

Background:
  Given that an invitation has been sent to gulli@snarpurtest.is
  And I go to the confirmation page for gulli@snarpurtest.is

Scenario: I can visit the confirmation page
  Then I should be on the confirmation page for gulli@snarpurtest.is

Scenario: I choose a password
  When I fill in "user_password" with "secret"
  And I fill in "user_password_confirmation" with "secret"
  And I click register
  Then I should see the updated invitation message

