require 'cucumber/rails'
require 'email_spec'
require 'email_spec/cucumber'
require 'faker'
Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}
# require "#{Rails.root}/spec/support/person_build_helpers.rb"
# require "#{Rails.root}/features/support/paths"
# require "#{Rails.root}/features/support/selectors"
#require "#{Rails.root}/features/support/pickle"
# require "#{Rails.root}/features/support/translation_helper"
include(PersonBuildHelpers)
if Survey.count == 0
  system "bundle exec rake surveyor FILE=surveys/rating_scale.rb"
end

# Capybara defaults to XPath selectors rather than Webrat's default of CSS3. In
# order to ease the transition to Capybara we set the default here. If you'd
# prefer to use XPath just remove this line and adjust any selectors in your
# steps to use the XPath syntax.
Capybara.default_selector = :css

# By default, any exception happening in your Rails application will bubble up
# to Cucumber so that your scenario will fail. This is a different from how
# your application behaves in the production environment, where an error page will
# be rendered instead.
#
# Sometimes we want to override this default behaviour and allow Rails to rescue
# exceptions and display an error page (just like when the app is running in production).
# Typical scenarios where you want to do this is when you test your error pages.
# There are two ways to allow Rails to rescue exceptions:
#
# 1) Tag your scenario (or feature) with @allow-rescue
#
# 2) Set the value below to true. Beware that doing this globally is not
# recommended as it will mask a lot of errors for you!
#
ActionController::Base.allow_rescue = false

# Remove this line if your app doesn't have a database.
# For some databases (like MongoDB and CouchDB) you may need to use :truncation instead.
DatabaseCleaner.strategy = :transaction

