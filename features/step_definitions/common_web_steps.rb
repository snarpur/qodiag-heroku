When /^(?:|I )choose (.*)(?: within (.*))?$/ do |choise, selector|
  unless choise.blank?
    with_scope(selector) do
      msg = "cannot choose field, no radio button with id, name, or label with this locator found"
      find(:xpath, "//input[ends-with(@id,#{choise}) and @type='radio']", :message => msg).set(true)
    end
  end
end

When /^(?:|I )click (.*)$/ do |name|
  click_on(I18n.t("actions.#{name}"))
end

Then /^the (.*) (.*) field(?: in the (.*) section)? has an? (.*) error$/ do |model, attribute, section, error|
  selector = section.nil? ? ".err-#{attribute}" : ".child.section .err-#{attribute}"
  translation =  get_error_translation(error, model, attribute)
  within(selector) do
    if page.respond_to? :should
      page.should have_content(translation)
    else
      assert page.has_content?(translation)
    end
  end
end

Then /^(?:|I )should see the (.*) (.*) message$/ do |message, action|
  translation = get_message_translation(message,action)
  within("#flash") do
    if translation.match(/\%\{.+\}/).nil?
      page.should have_content(translation)
    else
        translation.gsub!(/\%\{.+\}/,"(.+)")
        regexp = Regexp.new(translation)
        page.should have_xpath("//*", :text => regexp)
    end
  end
end

Then /^(?:|I )should not see the (.*) (.*) message$/ do |message, action|
  translation = get_message_translation(message,action)
  within("#flash") do
    if translation.match(/\%\{.+\}/).nil?
      page.should_not have_content(translation)
    else
        translation.gsub!(/\%\{.+\}/,"(.+)")
        regexp = Regexp.new(translation)
        page.should have_xpath("//*", :text => regexp)
    end
  end
end

When /^debug(?: for (.*))?$/ do |param|
 KK.see @last_email

end
