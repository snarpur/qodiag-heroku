Feature: Login
  As a user
  I want to log in
  So I can use the system

Background:
  Given the following roles exists:
    | name  |
    | super_admin |
    | caretaker |
    | client |

  And the following users exists:
   | email                | password | password_confirmation | user_roles        |
   | tom@mail.com         | welcome  | welcome               | name: super_admin |
   | johnny@mail.com      | welcome  | welcome               | name: caretaker   |


Scenario: See correct login information
  And I log in as "tom@mail.com" with password "welcome"
  Then I should see correct login information for user "tom@mail.com"
