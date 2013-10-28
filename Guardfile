# A sample Guardfile
# More info at https://github.com/guard/guard#readme


guard 'livereload' do
  watch(%r{app/.+\.(erb|haml)})
  watch(%r{app/helpers/.+\.rb})
  watch(%r{app/.+\.(erb|haml|coffee|mustache)})
  watch(%r{public/.+\.(css|js|html)})
  watch(%r{config/locales/.+\.yml})
end

guard 'haml' do
  watch(/^.+(\.html\.haml)/)
end


guard 'livereload' do
  watch(%r{(sass/).+\.scss}) { "compass compile" }
  watch(%r{(stylesheets/).+\.css})
end




guard :rspec do
  watch(%r{^spec/.+_spec\.rb$})
  watch(%r{^lib/(.+)\.rb$})     { |m| "spec/lib/#{m[1]}_spec.rb" }
  watch('spec/spec_helper.rb')  { "spec" }

  # Rails example
  watch(%r{^app/(.+)\.rb$})                           { |m| "spec/#{m[1]}_spec.rb" }
  watch(%r{^spec/(.+)\.rb$})                          { |m| "spec/lib/#{m[1]}_spec.rb" }
  watch(%r{^app/(.*)(\.erb|\.haml|\.slim)$})          { |m| "spec/#{m[1]}#{m[2]}_spec.rb" }
  watch(%r{^app/controllers/(.+)_(controller)\.rb$})  { |m| ["spec/routing/#{m[1]}_routing_spec.rb", "spec/#{m[2]}s/#{m[1]}_#{m[2]}_spec.rb", "spec/request/#{m[1]}_spec.rb"] }
  watch(%r{^spec/support/(.+)\.rb$})                  { "spec" }
  watch('config/routes.rb')                           { "spec/routing" }
  watch('app/controllers/application_controller.rb')  { "spec/controllers" }

  # Capybara features specs
  watch(%r{^app/views/(.+)/.*\.(erb|haml|slim)$})     { |m| "spec/features/#{m[1]}_spec.rb" }

  # Turnip features and steps
  watch(%r{^spec/acceptance/(.+)\.feature$})
  watch(%r{^spec/acceptance/steps/(.+)_steps\.rb$})   { |m| Dir[File.join("**/#{m[1]}.feature")][0] || 'spec/acceptance' }
end
