When /^(?:|I )choose a (.*)(?: within (.*))?$/ do |choise, selector|
  unless choise.blank?
    with_scope(selector) do
      msg = "cannot choose field, no radio button with id, name, or label with this locator found"
      find(:xpath, "//input[starts-with(@id,#{choise}) and @type='radio']", :message => msg).set(true)
    end
  end
end

When /^(?:|I )click (.*)(?: within (.*))?$/ do |button, selector|
  with_scope(selector) do
    click_button(I18n.t("actions.#{button}"))
  end
end

Then /^(?:|I )should see the (.*) error for (.*) (.*)$/ do |error, model, attribute|
  translation =  get_error_translation(error, model, attribute)
  with_scope(".err-#{attribute}") do
    if page.respond_to? :should
      page.should have_content(translation)
    else
      assert page.has_content?(translation)
    end
  end
end

Then /^(?:|I )should see the (.*) (.*) message$/ do |message, action|
  translation = get_message_translation(message,action)
  with_scope("#flash") do
    if page.respond_to? :should
      page.should have_content(translation)
    else
      assert page.has_content?(translation)
    end
  end
end

When /^I break$/ do
  breakpoint
end
