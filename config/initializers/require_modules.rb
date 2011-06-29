Dir[File.join(Rails.root, 'lib/app', '*.rb')].each do |f|
  require f
end