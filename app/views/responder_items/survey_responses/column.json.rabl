object @chart
attributes :chart_metrics => :chartMetrics,
           :chart_filters => :chartFilters,
           :group_title => :groupTitle


node :charts do |chart| 
  partial("responder_items/survey_responses/chart_json", :object => chart.charts)
end

