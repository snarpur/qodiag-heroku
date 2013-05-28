Snarpur::Application.configure do
  # Settings specified here will take precedence over those in config/environment.rb

  # In the development environment your application's code is reloaded on
  # every request.  This slows down response time but is perfect for development
  # since you don't have to restart the webserver when you make code changes.
  config.cache_classes = false

  # Log error messages when you accidentally call methods on nil.
  config.whiny_nils = true

  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  #config.action_view.debug_rjs             = true
  config.action_controller.perform_caching = false


  # Default mailer
  config.action_mailer.default_url_options = { :host => 'localhost:3000' }
  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.delivery_method = :smtp
  ActionMailer::Base.smtp_settings = {
  :user_name => "zodiac",
  :password => "a626669318b120ca",
  :address => "mailtrap.io",
  :port => 2525,
  :authentication => :plain,
}

  #Paperclip
  Paperclip.options[:command_path] = "/usr/bin/"

  config.colorize_logging = true
  config.active_support.deprecation = :log

  config.assets.enabled = true
  config.assets.compress = false
  # Expands the lines which load the assets
  config.assets.debug = false
  config.sass.compressed=false
  config.sass.debug_info = true
  config.sass.preferred_syntax = :sass
#  config.after_initialize do
#    Sass::Plugin.options[:never_update] = true
#  end
end
