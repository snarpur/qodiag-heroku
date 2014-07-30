collection @chart

attributes :chart_size => :size, 
  :question_list_drilldown => :questionListDrilldown,
  :access_code => :accessCode,
  # :chart => :chart,
  # :chart_data => :series,
  # :plot_options =>  :plotOptions,
  # :legend => :legend,
  # :credits => :credits,
  # :x_axis => :xAxis,
  # :y_axis => :yAxis,
  # :tooltip => :tooltip,
  # :title => :title,
  # :subtitle => :subtitle



node(:drilldownSeries, :if => lambda { |m| m.drilldown? }) do |m|
  m.drilldown
end

# node(:drilldown, :if => lambda { |m| m.drilldown? }) do |m|
#   {:series => []}
# end

[#<ChartRenderer::Column::Chart:0x007fbf63f54ce8 @options={}, @chart={:xchart_name=>"Chart", :chart_config=>{:credits=>{:enabled=>false}, :tooltip=>{:enabled=>true, :backgroundColor=>"rgba(255, 255, 255, 0.85)", :shared=>true, :useHTML=>true, :formatter=>{:name=>"countHighScores", :argument=>[2, 3]}}, :chart=>{:marginBottom=>100, :marginTop=>20, :animation=>false, :events=>{:click=>false}, :type=>"column"}, :title=>{:text=>nil}, :subtitle=>{:text=>nil, :align=>"right", :verticalAlign=>"top", :y=>10, :useHTML=>true}, :legend=>{:enabled=>true, :align=>"left", :floating=>true, :labelFormatter=>true, :itemHoverStyle=>{:color=>"#CCC"}}, :yAxis=>{:allowDecimals=>true, :title=>{:text=>nil}, :tickPosition=>"inside"}, :xAxis=>{:title=>{:text=>nil}, :labels=>{:formatter=>true, :align=>"center", :useHTML=>true}}, :plotOptions=>{:column=>{:cursor=>"pointer", :groupPadding=>0.1, :pointPadding=>0.1, :dataLabels=>{:enabled=>true, :formatter=>true, :borderRadius=>4, :color=>"#333", :backgroundColor=>"rgba(255, 255, 255, 0.5)", :borderWidth=>1, :borderColor=>"#999", :y=>-6}, :events=>{:legendItemClick=>false}}}}, :chart_name=>"AdhdRatingScale", :chart_type=>"Column", :extends=>"Column", :chart_metrics=>[{:name=>"average", :query=>"average"}, {:name=>"standard_deviation", :query=>"standard_deviation"}], :chart_filters=>[{:name=>"age", :query=>"surveys.adhd-rating-scale.age"}], :content=>{:high_scores=>[2, 3], :result_names=>["average"], :name=>"score", :question_list_drilldown=>true, :question_groups=>["inattention", "impulsivity_hyperactivity"]}}, @response_set=#<ResponseSet id: 2, user_id: 6, survey_id: 1, access_code: "fie-CxNrzA", started_at: "2014-07-18 15:08:29", completed_at: "2013-07-27 15:08:29", created_at: "2014-07-18 15:08:29", updated_at: "2014-07-18 15:08:29", api_id: "e5ed6096-d4f5-460d-b263-1960664dc8ec">, @subject_series={:name=>"Jósef Friðriksson", :data=>[{:y=>12}, {:y=>17}]}, @reference_values=[{:name=>"average", :data=>[3.2, 4.2]}]>, #<ChartRenderer::Column::Chart:0x007fbf64286038 @options={}, @chart={:xchart_name=>"Chart", :chart_config=>{:credits=>{:enabled=>false}, :tooltip=>{:enabled=>false, :backgroundColor=>"rgba(255, 255, 255, 0.85)"}, :chart=>{:marginBottom=>100, :marginTop=>20, :animation=>false, :events=>{:click=>false}, :type=>"column"}, :title=>{:text=>nil}, :subtitle=>{:text=>nil, :align=>"right", :verticalAlign=>"top", :y=>10, :useHTML=>true}, :legend=>{:enabled=>false, :align=>"left", :floating=>true, :labelFormatter=>true, :itemHoverStyle=>{:color=>"#CCC"}}, :yAxis=>{:allowDecimals=>true, :title=>{:text=>nil}, :tickPosition=>"inside", :opposite=>true, :maxPadding=>0.01, :labels=>{:useHTML=>true}}, :xAxis=>{:title=>{:text=>nil}, :labels=>{:formatter=>true, :align=>"center", :useHTML=>true}}, :plotOptions=>{:column=>{:cursor=>"pointer", :groupPadding=>0.1, :pointPadding=>0.1, :dataLabels=>{:enabled=>true, :formatter=>true, :borderRadius=>4, :color=>"#333", :backgroundColor=>"rgba(255, 255, 255, 0.5)", :borderWidth=>1, :borderColor=>"#999", :y=>-6}, :events=>{:legendItemClick=>false}, :point=>{:events=>{:click=>false}}}}}, :chart_name=>"AdhdRatingScale", :chart_type=>"Column", :extends=>"Column", :chart_metrics=>[{:name=>"average", :query=>"average"}, {:name=>"standard_deviation", :query=>"standard_deviation"}], :chart_filters=>[{:name=>"age", :query=>"surveys.adhd-rating-scale.age"}], :content=>{:high_scores=>[2, 3], :result_names=>["average"], :name=>"total", :question_groups=>[{:name=>"total", :total=>["inattention", "impulsivity_hyperactivity"]}]}}, @response_set=#<ResponseSet id: 2, user_id: 6, survey_id: 1, access_code: "fie-CxNrzA", started_at: "2014-07-18 15:08:29", completed_at: "2013-07-27 15:08:29", created_at: "2014-07-18 15:08:29", updated_at: "2014-07-18 15:08:29", api_id: "e5ed6096-d4f5-460d-b263-1960664dc8ec">, @subject_series={:name=>"Jósef Friðriksson", :data=>[{:y=>29}]}, @reference_values=[{:name=>"average", :data=>[7.5]}]>]
