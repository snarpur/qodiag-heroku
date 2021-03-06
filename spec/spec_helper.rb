require 'rubygems'
require 'spork'

Spork.prefork do
  # This file is copied to spec/ when you run 'rails generate rspec:install'
  ENV["RAILS_ENV"] ||= 'test'
  require File.expand_path("../../config/environment", __FILE__)
  require 'rspec/rails'
  require 'email_spec'
  require 'capybara/rspec'
  # Requires supporting ruby files with custom matchers and macros, etc,
  # in spec/support/ and its subdirectories.
  Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}

  RSpec.configure do |config|
    config.filter_run :focus => true
    config.run_all_when_everything_filtered = true


    config.include(EmailSpec::Helpers)
    config.include(EmailSpec::Matchers)
    config.include(PersonBuildHelpers)
    # == Mock Framework
    #
    # If you prefer to use mocha, flexmock or RR, uncomment the appropriate line:
    #
    # config.mock_with :mocha
    # config.mock_with :flexmock
    # config.mock_with :rr
    config.mock_with :rspec

    # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
    #config.fixture_path = "#{::Rails.root}/spec/fixtures"

    # If you're not using ActiveRecord, or you'd prefer not to run each of your
    # examples within a transaction, remove the following line or assign false
    # instead of true.
    config.use_transactional_fixtures = true
    #needed for spork
    ActiveSupport::Dependencies.clear

    # Session helpers - For Capybara
    config.include Features::SessionHelpers, :type => :feature

    #Devise
    config.include Devise::TestHelpers, :type => :controller

    #Controller Macros
    config.extend ControllerMacros, :type => :controller

    config.include ValidUserRequestHelper

  end


end

Spork.each_run do

  load "#{Rails.root}/config/routes.rb"
  FactoryGirl.factories.clear
  FactoryGirl.sequences.clear
  Dir[Rails.root.join("spec/factories/**/*.rb")].each {|f| load f}
  Dir["#{Rails.root}/app/**/*.rb"].each { |f| load f }
  Dir["#{Rails.root}/lib/app/**/*.rb"].each { |f| load f }

end



