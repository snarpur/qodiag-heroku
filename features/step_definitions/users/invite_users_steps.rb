When /^I fill in user details with valid input$/ do
  person = "activerecord.attributes.person"
  with_scope("the child section") do
    fill_in I18n.t("#{person}.firstname"), :with => "somename"
    fill_in I18n.t("#{person}.lastname"), :with => "somename"
  end
  with_scope("the parent section") do
    fill_in I18n.t("#{person}.firstname"), :with => "somename"
    fill_in I18n.t("#{person}.lastname"), :with => "somename"
  end
end


