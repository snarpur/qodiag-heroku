When /^(?:|I )choose a (.*)(?: within (.*))?$/ do |choise, selector|
  unless choise.blank?
    with_scope(selector) do
      msg = "cannot choose field, no radio button with id, name, or label with this locator found"
      find(:xpath, "//input[starts-with(@id,#{choise}) and @type='radio']", :message => msg).set(true)
    end
  end
end

When /^(?:|I )click (.*)$/ do |button|
    click_button(I18n.t("actions.#{button}"))
end

Then /^(?:|I )should see the (.*) error for (.*) (.*)$/ do |error, model, attribute|
  translation =  get_error_translation(error, model, attribute)
  within(".err-#{attribute}") do
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

When /^I am logged in as (.*)$/ do |role|
    Factory(:user,
            :email => "#{role}@#{role}.com",
            :password => "welcome",
            :roles => [Factory(:role, :name => role)])
    visit path_to('sign in page')
    fill_in "user_email", :with => "#{role}@#{role}.com"
    fill_in "user_password", :with => "welcome"
    click_button I18n.t('actions.sign_in')
end


When /^I break$/ do
  breakpoint
end
