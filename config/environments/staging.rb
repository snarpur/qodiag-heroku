Snarpur::Application.configure do
  # Settings specified here will take precedence over those in config/environment.rb

  # Specifies the header that your server uses for sending files
  config.action_dispatch.x_sendfile_header = "X-Sendfile"
  #config.action_dispatch.x_sendfile_header = "X-Accel-Redirect"


  # Enable serving of images, stylesheets, and javascripts from an asset server
  # config.action_controller.asset_host = "http://assets.example.com"

  # Disable delivery errors, bad email addresses will be ignored
  # config.action_mailer.raise_delivery_errors = false
  # config.action_mailer.default_url_options = { :host => 'localhost:3000' }
  config.action_mailer.default_url_options = { :host => 'www.qodiag.com' }
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
  # Enable threaded mode
  # config.threadsafe!

  #Paperclip
  Paperclip.options[:command_path] = "/usr/bin/"
  
  # Code is not reloaded between requests
  config.cache_classes = true

  # Full error reports are disabled and caching is turned on
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = false

  # Disable Rails's static asset server (Apache or nginx will already do this)
  config.serve_static_assets = false



  # Compress JavaScripts and CSS
  config.assets.compress = true
  config.assets.js_compressor = :uglifier
  config.assets.css_compressor = :yui
  

  # Don't fallback to assets pipeline if a precompiled asset is missed
  config.assets.compile = false

  # Generate digests for assets URLs FALSE to tested locally
  config.assets.digest = true




  # See everything in the log (default is :info)
  # config.log_level = :debug

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation can not be found)
  config.i18n.fallbacks = true

  # Send deprecation notices to registered listeners
  config.active_support.deprecation = :notify

  # config.sass.compressed = false
  # config.sass.debug_info = false
  # config.sass.preferred_syntax = :sass
end
