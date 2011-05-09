Feature: Invite users
  As an admin
  I want to create users
  So they can use the system

Scenario Outline: Ability for users to send user invitations
  Given I am logged in as <user_with_role>
  And I go to the <user> invitation page
  Then I should be on the <user> invitation page
  And I should <see_error_if_I_am_not_authorized>

  Examples:
    | user_with_role | user      | see_error_if_I_am_not_authorized         |
    | caretaker      | client    | not see the error_401 page_error message |
    | caretaker      | caretaker | see the error_401 page_error message     |
    | client         | caretaker | see the error_401 page_error message     |
    | client         | client    | see the error_401 page_error message     |


Scenario Outline: Ability for unregistered users to send user invitations
  When I go to the <user> invitation page
  Then I should see the error_401 page_error message

  Examples:
    | user      |
    | client    |
    | caretaker |




