if config.environment_name == "alfa"
  # Delete the log files first
  run "rm #{config.release_path}/log/populate_reset.log"
  run "rm #{config.release_path}/log/populate.log"
  run "rm #{config.release_path}/log/national_register.log"

  #Run the populators
  run "bundle exec rake db:populate_reset[reset] >> #{config.release_path}/log/populate_reset.log"
  run "bundle exec rake db:populate_ini_file[orri] >> #{config.release_path}/log/populate.log"
  run "bundle exec rake db:data:load_dir dir=data >> #{config.release_path}/log/national_register.log"
end