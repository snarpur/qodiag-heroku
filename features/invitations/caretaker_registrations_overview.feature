Feature: Careteaker has overview over uncompleted, completed delayed registrations
  As a caretaker
  I like to see the status of registrations
  So that I can see the requested information

Scenario: Invited user should have a pending registration
  Given the user Bob sent an invitation to nonni@kalli.is
  And  that I sent an invitation to siggi@kalli.is
  When I go to the user home page
  Then I see siggi@kalli.is in uncompleted registrations
  And I do not see nonni@kalli.is in uncompleted registrations

# Scenario: Invited user should have a uncompleted registration
#   Given the user Bob sent an invitation to nonni@kalli.is
#   And  that I sent an invitation to siggi@kalli.is
#   When I go to the user home page
#   Then I see siggi@kalli.is in uncompleted registrations
#   And I do not see nonni@kalli.is in uncompleted registrations