
Feature: Request that client completes a survey
  As a caretaker
  I want to send a request to my client to complete a survey
  So I can know more about their condition

  Background: Caretaker with patients
      Given I am logged as a caretaker with a patient named Fred
      And I am on the page for that patient


  Scenario: Send a survey to a client
    When I click request_survey
    And debug
    And I choose Rating scale
    And show me the page
    And click send
    Then I should see the requested survey message
    And I should see Rating scale in uncomplete surveys
