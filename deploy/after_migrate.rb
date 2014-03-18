if config.environment_name == "alfa"
  run "bundle exec rake db:populate_reset[reset] >> #{config.release_path}/log/populate_reset.log"
  run "bundle exec rake db:populate_ini_file[orri] >> #{config.release_path}/log/populate.log"
end