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



