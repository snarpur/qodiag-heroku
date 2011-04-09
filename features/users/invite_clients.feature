@invite_clients
Feature: Invite new clients
      As a specialist
      I want to invite clients
      So I can improve their treatment

Background:
  Given the following users exists:
   | email        | user_roles   |
   | jim@mail.com | name: client |

Scenario Outline: Invite new client user
  Given I am logged in as caretaker
  And I go to the client invitation page
  When I fill in "user_email" with "<user_email>"
  And I fill in user details with <user_details>
  And I click create
  Then I should <see_action>


  Examples:
  | user_email         | user_details | see_action                                   |
  | test@test.is       | valid input  | see the send_instructions invitation message |
  | jim@mail.com | valid input  | see the taken error for user email           |
  | joema              | valid input  | see the invalid error for user email         |
  |                    | valid input  | see the blank error for user email           |