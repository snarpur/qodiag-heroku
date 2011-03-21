Feature: Manage users
  As an adminra
  I want to create users
  So they can use the system


@focus
Scenario Outline: Ability to register new user
  Given the following roles exists:
    | name  |
    | admin |
    | staff |

  And the following user exists:
    | email        | password | password_confirmation | user_roles   |
    | tom@mail.com | welcome  | welcome               | name: admin  |
    | johnny@mail.com | badboy  | badboy              | name: staff  |

  When I go to the sign in page
  And I log in as "<user_email>" with password "<password>"
  And I go to the user registration page
  Then I should be on the <page>
  And show me the page

  Examples:
    | user_email      | password | page                   |
    | tom@mail.com    | welcome  | user registration page |
    | johnny@mail.com | badboy   | users page              |


Scenario Outline: Register new user
  Given I am on the user registration page
  And the following user exists:
    | email        | password | password_confirmation |
    | tom@mail.com | welcome  | welcome               |
    | johnny@mail.com | badboy  | badboy              |

  When I fill in "user_email" with "<user_email>"
  And I fill in "user_password" with "<user_password>"
  And I fill in "user_password_confirmation" with "<user_password_confirmation>"
  And I choose a <user_role>
  And I click create
  Then I should <see_action>


  Examples:
  | user_email   | user_password | user_password_confirmation | user_role | see_action                                   |
  | test@test.is | secret        | secret                     | user_role | see the signed_up registration message       |
  | tom@mail.com | secret        | secret                     | user_role | see the taken error for user email           |
  | joema        | secret        | secret                     | user_role | see the invalid error for user email         |
  |              | secret        | secret                     | user_role | see the blank error for user email           |
  | test@test.is |               | secret                     | user_role | see the blank error for user password        |
  | test@test.is | secret        | secre                      | user_role | see the confirmation error for user password |
  | test@test.is | wu            | wu                         | user_role | see the too_short error for user password    |
  | test@test.is | secret        | secret                     |           | see the blank error for role name            |




