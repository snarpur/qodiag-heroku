Given /^that an invitation has been sent to (.*@.*\..*)$/ do |email|
  @last_mail = email
  steps %Q{
      Given I am logged in as caretaker
      And I go to the client invitation page
      And I fill in "user_email" with "#{email}"
      And I fill in user details with valid input
      And I click create
      And I sign out
  }
end
Given /^the user (.*) sent an invitation to (.*@.*\..*)$/ do |name,email|
  @last_mail = email
  steps %Q{
      Given I am #{name} and I am logged in as caretaker
      And I go to the client invitation page
      And I fill in "user_email" with "#{email}"
      And I fill in user details with valid input
      And I click create
      And I sign out
  }
end

Given /^that I sent an invitation to (.*@.*\..*)$/ do |email|
  @last_mail = email
  steps %Q{
      Given I am logged in as caretaker
      And I go to the client invitation page
      And I fill in "user_email" with "#{email}"
      And I fill in user details with valid input
      And I click create
  }
end

When /^I fill in user details with valid input$/ do
  person = "activerecord.attributes.person"
  with_scope("the child section") do
    fill_in I18n.t("#{person}.firstname"), :with => "Child"
    fill_in I18n.t("#{person}.lastname"), :with => "Child lastname"
    choose I18n.t("terms.girl")
  end
  with_scope("the parent section") do
    fill_in I18n.t("#{person}.firstname"), :with => "Parent"
    fill_in I18n.t("#{person}.lastname"), :with => "Parent Lastname"
    choose I18n.t("terms.father")
  end
end

When /^I fill in user details with (.+) (.+) missing$/ do |attr_for, missing_field|
  i18_path = "activerecord.attributes.person"
  ["parent","child"].each do |person|
    with_scope("the #{person} section") do
      ["firstname","lastname"].each do |field|
      value = missing_field.eql?(field) && attr_for.eql?(person) ? "" : "somename"
      fill_in I18n.t("#{i18_path}.#{field}"), :with => value
    end
    end
  end
end