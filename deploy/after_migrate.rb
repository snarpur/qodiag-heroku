run "echo 'working in environment #{config.environment_name}'"
if config.environment_name is "alfa"
  run "echo 'reseting the database....'"
  run "bundle exec rake db:populate_reset[reset] >> #{release_path}/log/populate_reset.log"
  run "echo 'populating data to the database....'"
  run "bundle exec rake db:populate_ini_file[orri] >> #{release_path}/log/populate.log"
end