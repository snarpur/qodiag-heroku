@invite_users
Feature: Invite users
  As an admin
  I want to create users
  So they can use the system

Background:

 Given the following users exists:
   | email                | password | password_confirmation | user_roles        |
   | super_admin@mail.com | welcome  | welcome               | name: super_admin |
   | caretaker@mail.com   | welcome  | welcome               | name: caretaker   |
   | tom@mail.com         | welcome  | welcome               | name: super_admin |
   | johnny@mail.com      | welcome  | welcome               | name: caretaker   |



Scenario Outline: Ability to invite new user
  Given I log in as "<user_email>" with password "<password>"
  And I go to the <role> invitation page
  Then I should be on the <role> invitation page

  Examples:
    | user_email      | password | role      | message                                  |
   | tom@mail.com    | welcome  | caretaker | not see the error_401 page_error message |
   | johnny@mail.com | welcome  | caretaker | see the error_401 page_error message     |
   | johnny@mail.com | welcome  | client    | not see the error_401 page_error message |


Scenario Outline: Invite new user caretaker
  Given I am logged in as super_admin
  And I go to the caretaker invitation page
  When I fill in "user_email" with "<user_email>"
  And I fill in user details with <user_details>
  And I click create
  Then I should <see_action>


  Examples:
  | user_email         | user_details | see_action                                   |
  | test@test.is       | valid input  | see the send_instructions invitation message |
  | caretaker@mail.com | valid input  | see the taken error for user email           |
  | joema              | valid input  | see the invalid error for user email         |
  |                    | valid input  | see the blank error for user email           |






