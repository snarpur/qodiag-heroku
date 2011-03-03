Feature: Manage users

  In order to use the system
  As a potential user
  I want to register
  
Background: I am in the right place
  Given I am on the new user registration page
  And the following users exists:
    |email        | password |
    |tom@mail.com | welcome  |

Scenario: Register new user
  When I fill in "user_email" with "test@test.is" 
  And I fill in "user_password" with "secret"
  And I fill in "user_password_confirmation" with "secret"
  And I choose a role
  And I press "actions.sign_up"
  Then I should see "devise.registrations.signed_up"
  
Scenario: Empty form submission
  When I press "actions.sign_up"
  Then I should see "activerecord.errors.messages.blank" 


Scenario: Form submission with errors
  When I fill in "user_email" with "joe@mail.com"
  And I fill in "user_password" with "welcome"
  And I fill in "user_password_confirmation" with "welco"
  And I press "actions.sign_up"
  And I should see "activerecord.errors.messages.confirmation"

Scenario: User already exists 
  When I fill in "user_email" with "tom@mail.com"
  And I fill in "user_password" with "tommy"
  And I fill in "user_password_confirmation" with "tommy"
  And I press "actions.sign_up"
  Then I should see "activerecord.errors.messages.taken" 

  # Scenario: Username already exists
  # 
  # Scenario: User email already exists

#------
  # Background: Logged in as admin
  #   Given the following users exist:
  #     | Email      | Password |
  #     | foo@foo.is | secret   |
  #   
  #   And the following roles exist:
  #     | Name  | User              |
  #     | admin | Email: foo@foo.is |
  #     | admin | Email: Bar        |
  # 
  # Scenario:
  #   When I create a new user with role as staff
  #   Then the new user has an account    