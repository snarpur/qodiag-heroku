APP_CONFIG ||= {}
APP_CONFIG.merge!(YAML.load_file("#{Rails.root}/config/config.yml")[Rails.env].symbolize_keys!)