collection @chart, :object_root => false, :root => "charts"
attributes  :chart_size => :size
           # :categories => :categories,
           # :title => :title,
           # :chart_settings => :chart,
           # :tooltip_settings => :tooltip,
           # :x_axis_settings => :xAxis,
           # :y_axis_settings => :yAxis,
           # :legend_settings => :legend,
           # :plot_options_settings => :plotOptions
  
node do |a|
  a.chart_output
end


