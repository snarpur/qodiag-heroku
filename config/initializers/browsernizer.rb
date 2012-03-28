Rails.application.config.middleware.use Browsernizer::Router do |config|
  config.supported "Internet Explorer", false
  config.supported "Firefox", "7"
  config.supported "Opera", "11.1"
  config.supported "Chrome", "8"

  config.location  "/pages/browser_update"
  config.exclude   %r{^/assets}
  config.exclude   %r{^/users/sign_in}
  config.exclude   %r{^/(?![\w])}
end
