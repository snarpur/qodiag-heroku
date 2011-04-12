def run_spec(file)
  puts ":::WATCHING:::"
  unless File.exist?(file)
    puts "#{file} does not exist"
    return
  end
  puts "Running #{file}"
  system "bundle exec rspec #{file}"
  puts
end


def run_feature(file)
    puts ":::WATCHING:::"
    unless File.exist?(file)
    puts "#{file} does not exist"
    return
  end
  puts "Running #{file}"
  system "bundle exec cucumber -r features #{file}"
  puts
end

watch("spec/.*/*_spec\.rb") do |match|
  run_spec match[0]
end

watch("app/(.*/.*)\.rb") do |match|
  run_spec %{spec/#{match[1]}_spec.rb}
end

watch("features/.*/.*\.feature") do |match|
  run_feature match[0]
end