collection @chart

attributes :chart_size => :size, 
  # :question_list_drilldown => :questionListDrilldown,
  # :access_code => :accessCode,
  :chart => :chart,
  :chart_data => :series,
  :plot_options =>  :plotOptions,
  :legend => :legend,
  :credits => :credits,
  :x_axis => :xAxis,
  :y_axis => :yAxis,
  :tooltip => :tooltip,
  :title => :title,
  :subtitle => :subtitle



node(:drilldownSeries, :if => lambda { |m| m.drilldown? }) do |m|
  m.drilldown
end

