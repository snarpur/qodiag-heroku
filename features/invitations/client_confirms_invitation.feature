Feature: Confirm user invitation
         As an Invited user
         I want to confirm my invitation
         So that I can login

Background:
  Given that an invitation has been sent to gulli@snarpurtest.is

  Scenario: Invited client receives email invitaion
    Then I should receive an email

  Scenario: I can visit the confirmation page
    When I open the email
    And I follow "sign_up" in the email
    Then I should be on the confirmation page for gulli@snarpurtest.is

  Scenario: I confirm the account
    Given I am on the confirmation page for gulli@snarpurtest.is
    When I fill in "user_password" with "secret"
    And I fill in "user_password_confirmation" with "secret"
    And I click register
    Then I should see the updated invitation message

