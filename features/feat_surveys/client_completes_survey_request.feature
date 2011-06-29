Feature: As a client
         I want to complete a survey request
         So that my doctor can make diagnose

Background: I received a mail with a request
  Given a survey request regarding Henry has been sent to Bob
  And I open the email

Scenario: Client follow a link in the survey request email
  When I log into my user account
  Then I should see Rating scale in uncomplete surveys

Scenario: Client follow a link in the survey request email
  When I log into my user account
  And I click finish
  And I complete the survey
  And I click finish
  And show me the page