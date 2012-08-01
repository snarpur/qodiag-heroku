collection @chart, :object_root => false, :root => "charts"
attributes  :chart_size => :size,
            :access_code => :accessCode

  
node do |a|
  a.chart_output
end


