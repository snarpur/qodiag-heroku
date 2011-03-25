Feature: Manage users
  As an adminra
  I want to create users
  So they can use the system

Background:
  Given the following roles exists:
    | name  |
    | super_admin |
    | caretaker |

  And the following user exists:
    | email        | password | password_confirmation | user_roles   |
    | tom@mail.com | welcome  | welcome               | name: super_admin  |
    | johnny@mail.com | badboy  | badboy              | name: caretaker  |

Scenario: See correct login information
  When I log in as "tom@mail.com" with password "welcome"
  Then I should see correct login information for user "tom@mail.com"

Scenario Outline: Ability to register new user
  Given I am on the sign in page
  And I log in as "<user_email>" with password "<password>"
  And I go to the user registration page
  Then I should be on the <page>

  Examples:
    | user_email      | password | page                   |
    | tom@mail.com    | welcome  | user registration page |
    | johnny@mail.com | badboy   | home page              |

Scenario Outline: Register new user
  Given I log in as "tom@mail.com" with password "welcome"
  And I go to the user registration page
  When I fill in "user_email" with "<user_email>"
  And I fill in "user_password" with "<user_password>"
  And I fill in "user_password_confirmation" with "<user_password_confirmation>"
  And I click create
  Then I should <see_action>


  Examples:
  | user_email      | user_password | user_password_confirmation | see_action                                   |
  | test@test.is    | secret        | secret                     | see the signed_up registration message       |
  | johnny@mail.com | secret        | secret                     | see the taken error for user email           |
  | joema           | secret        | secret                     | see the invalid error for user email         |
  |                 | secret        | secret                     | see the blank error for user email           |
  | test@test.is    |               | secret                     | see the blank error for user password        |
  | test@test.is    | secret        | secre                      | see the confirmation error for user password |
  | test@test.is    | wu            | wu                         | see the too_short error for user password    |





