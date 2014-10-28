source "http://rubygems.org"

ruby "1.9.3"
gem "rails", "3.2.11"

gem "sass","~> 3.1.11"
gem "ejs"

# gem 'mysql2', '~> 0.3.7'
gem 'pg'
gem 'thin'
gem 'activerecord-postgresql-adapter'
gem 'json'
# gem "bcrypt-ruby", "~> 3.1.5"
gem "bcrypt"
gem 'devise', '2.2.4'
gem 'devise_invitable', '1.0.3'
gem "cancan"
gem "hpricot"
gem "ruby_parser"
gem "simple_form"
gem "rainbow", '1.1.4'
gem "surveyor",:github => "NUBIC/surveyor", tag: 'v1.4.0'
gem 'formtastic-bootstrap'
gem "fastercsv", "~> 1.5.4"
gem "hash-deep-merge"
gem 'rails-dev-tweaks', '~> 0.6.1'
gem "i18n-js"
gem "factory_girl_rails", "~> 3.0"
gem "faker"
# gem 'newrelic_rpm'
# gem 'ey_config'
gem 'browsernizer'
gem 'rabl'
gem 'active_attr'
gem 'draper', '~> 1.0'
gem 'time_diff'
gem 'rb-readline', '~> 0.4.2'
gem "paperclip", "~> 3.0"
gem 'oj'
gem 'gon'
gem 'acts_as_commentable', '3.0.1'
gem 'yaml_db'
gem 'fontcustom'
gem 'ini_file'
gem 'js-routes'

group :production, :staging do
  gem 'rails_12factor'
  gem 'heroku'
end
# Gem to show the spinner when change the view



group :assets do
  gem 'sass-rails' #, "  ~> 3.2.3"
  gem 'coffee-rails', "~> 3.2.1"
  gem 'coffee-rails-source-maps'
  gem 'yui-compressor'
  gem 'turbo-sprockets-rails3'
  gem 'uglifier', '>=1.0.3'
  gem 'closure-compiler'
  gem 'compass_twitter_bootstrap'
  gem 'compass-rails'
  gem 'eco'

end


group :development do
  gem 'quiet_assets'
  gem 'sextant'
  gem 'better_errors', :require => RUBY_PLATFORM.include?('darwin') ? 'better_errors' : false
  gem 'binding_of_caller', :require => RUBY_PLATFORM.include?('darwin') ? 'binding_of_caller' : false
  gem 'meta_request'
  gem 'xray-rails'
  # gem 'mysql2', '~> 0.3.7'
end

group :development, :test do
  gem "rspec-rails"
  # gem "shoulda-matchers"
  #gem "cucumber-rails", ">= 0.3.2"
  #gem "capybara"
  #gem "capybara-webkit"
  gem "database_cleaner"
  gem "pickle"
  gem "email_spec"
  # gem "ruby-debug"
  gem "nokogiri"
  # gem "launchy"
  gem "wirble"
  gem "hirb-unicode"
  gem "awesome_print"
  gem "spork", "~> 0.9.0.rc"
  gem "watchr"
  gem "syntax"
  gem 'debugger'
  # gem "rb-fsevent", :group => :test, :require => false if RUBY_PLATFORM =~ /darwin/i
  gem 'guard-rspec'
  gem "guard-haml"
  gem "guard-livereload"
  gem "selenium-webdriver", "~> 2.35.1"  # gem "letter_opener"
end


