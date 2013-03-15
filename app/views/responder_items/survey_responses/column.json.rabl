object @chart
attributes :chart_metrics => :chartMetrics

child @chart.charts => :charts do
  attributes :chart_size => :size, 
             :question_list_drilldown => :questionListDrilldown,
             :access_code => :accessCode,
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
  end
