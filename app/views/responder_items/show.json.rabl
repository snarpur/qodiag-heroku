collection @chart, :object_root => false, :root => "charts"
attributes  :chart_size => :size,
            # :chart_metrics =>
            :question_list_drilldown=> :questionListDrilldown,
            :access_code => :accessCode

  
node do |a|
  a.chart_output
end


