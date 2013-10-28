RSpec.configure do |config|

  config.before(:suite) do
    DatabaseCleaner.strategy = :truncation, {:except => ["roles"]}
    DatabaseCleaner.clean_with(:transaction)
  end

  config.before(:suite) do
    DatabaseCleaner.start
  end

  config.after(:suite) do
    DatabaseCleaner.clean
  end

end