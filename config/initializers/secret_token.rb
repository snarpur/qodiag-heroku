# Be sure to restart your server when you modify this file.

# Your secret key for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.

# REFACTOR: In prioduction, we should save this token in an env Variable
Rails.application.config.secret_token = 'a81fc2a7801650957de794f7a71b157237e52888818124a880cf2be0a44c0338554cdb3d3c91fd0de11eb1bb239a6985cd79aa66e8524bf0fc2942632c8d96a4'
