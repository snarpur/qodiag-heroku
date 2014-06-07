object @chart
attributes :chart_metrics => :chartMetrics,
           :chart_filters => :chartFilters


node :charts do |chart| 
  partial("responder_items/survey_responses/chart_json", :object => chart.charts)
end

