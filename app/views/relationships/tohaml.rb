Dir.foreach(".") do |file|
  next if /^\./.match(file)
  if File.extname(file).eql?('.erb')
    base = File.basename(file, '.erb')
    puts "Converting #{file} to HAML #{base}.haml"
    system "html2haml #{file} > #{base}.haml"
  else
    puts "Skipping #{file}"
  end
end
