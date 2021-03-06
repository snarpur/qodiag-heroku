
require File.expand_path('../boot', __FILE__)
require 'rails/all'

if defined?(Bundler)
    Bundler.require *Rails.groups(:assets => %w(development test staging))
end


module Snarpur
  class Application < Rails::Application

    # stylesheets_directory = "#{Rails.root}/app/assets/stylesheets"
    # config.assets.precompile << /(^[^_]|\/[^_])[^\/]*/
    config.assets.precompile << /(^[^_\/]|\/[^_])[^\/]*$/
    config.assets.precompile << ['vendor/assets/javascripts/precomplie']
    
    config.assets.enabled = true
    config.assets.paths << Rails.root.join("app", "assets", "fonts")
    
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    Haml::Template.options[:escape_html] = true
    # Add additional load paths for your own custom dirs
    config.autoload_paths += %W(#{config.root}/app/models/charts)
    config.autoload_paths += %W(#{config.root}/lib)
    config.autoload_paths += %W(#{config.root}/app/presenters)
    config.autoload_paths += Dir["#{config.root}/lib/**/*"]

    # Only load the plugins named here, in the order given (default is alphabetical).
    # :all can be used as a placeholder for all plugins not explicitly named
    # config.plugins = [ :exception_notification, :ssl_requirement, :all ]

    # Activate observers that should always be running
    # config.active_record.observers = :cacher, :garbage_collector, :forum_observer

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    #config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}')]
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**/*.{rb,yml}').to_s]
    config.i18n.default_locale = :is

    # Configure generators values. Many other options are available, be sure to check the documentation.
    # config.generators do |g|
    #   g.orm             :active_record
    #   g.template_engine :erb
    #   g.test_framework  :test_unit, :fixture => true
    # end

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]

    # javascript
    config.action_view.javascript_expansions = { :defaults => %w(rails.js) }

    if Rails.env.test?
      initializer :after => :initialize_dependency_mechanism do
        ActiveSupport::Dependencies.mechanism = :load
      end
    end
  end
end


