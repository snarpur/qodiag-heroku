# class LineChartRenderer
 
#  def initialize(response_sets)
#     @response_sets = response_sets
#     get_chart_config
#   end

#   def get_chart_config
#     @chart_config = YAML::load(File.open("#{Rails.root}#{APP_CONFIG['chart_config_path']}/#{@response_sets.first.survey_name.underscore}_line.yml")).symbolize_all_keys!
#   end


#   def chart_class
#     @chart_config[:chart_class].constantize
#   end

#   def result_to_chart
#     size = 0
#     translations = nil
#     json = @chart_config[:charts].map do |config|
#       chart_config = @chart_config[:defaults].deep_merge(config)
#       #results = chart_class.send(:new, chart_config ,@response_set)
#       results = LineChart.new(chart_config,@response_sets)

#       chart = {:chart => {
#                 :series => results.series,
#                 :xAxis => {:categories => results.categories}
                 
#                }
#             }
#       chart_config.deep_merge(chart[:chart])
#     end
#   end
# end