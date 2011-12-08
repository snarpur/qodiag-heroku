Given /^a survey request regarding (.*) has been sent to (.*)$/ do |patient,guardian|
  steps %Q{
    Given I am logged as a caretaker with a patient named #{patient}
    And I am on the page for that patient
    And I click request_survey
    And I choose Rating scale
    And click send
    And I sign out
  }
  set_assigned(:last_mail, get_assigned(:patient).guardian_client.user.email)
end

Given /^I have sent a survey request$/ do
  steps %Q{
    Given I am logged as a caretaker with patients
    And a survey named Rating scale
    And I am on the page for a patient
    When I click request_survey
    And I choose Rating scale
    And click send
  }
end

When /^I complete the survey$/ do
  msg = "no such radio button"
  num = rand(3) +1
  page.all(:xpath, "//fieldset/descendant::input[@type='radio'][#{num}]", :message => msg).each do |radio|
    radio.set(true)
  end

end
