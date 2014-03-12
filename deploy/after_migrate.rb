info("working in environment #{config.environment_name}")
if config.environment_name == "alfa"
  info("reseting the database....")
  run "bundle exec rake db:populate_reset[reset] >> #{config.release_path}/log/populate_reset.log"
  info("populating data to the database....")
  run "bundle exec rake db:populate_ini_file[orri] >> #{config.release_path}/log/populate.log"
end