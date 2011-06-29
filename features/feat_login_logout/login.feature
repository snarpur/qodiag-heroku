Feature: Login
  As a user
  I want to log in
  So I can use the system

Background:
  Given the following roles exists:
    | name  |
    | caretaker |
    | client |

  And the following users exists:
   | email        | password | password_confirmation | user_roles      |
   | tom@mail.com | welcome  | welcome               | name: caretaker |


Scenario: See correct login information
  When I log in as tom@mail.com with password welcome
  Then I should see correct login information for user tom@mail.com


