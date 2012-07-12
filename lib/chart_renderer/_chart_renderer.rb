# class ChartRenderer
  
#   def initialize(response_set)
#     @response_set = response_set
#     @chart_config = get_chart_config
#   end

#   def config_class
#     ChartConfig.const_get(@response_set.survey_name.underscore.camelize)
#   end
  
#   def get_chart_config
#     # config_class = eval("ChartConfig::#{@response_set.survey_name.underscore.camelize}")
#     config_class.send(:instance).get
#   end

#   def chart_renderer_class(config)
#       KK.log "append renderer"
#       KK.log "#{config[:chart_name]}Renderer"
#       KK.log "#{config[:chart_name]}"
#       KK.log "defined?"
#       #TODO:  start to solve loading of modules in lib
#       KK.log Charts.const_defined?("#{config[:chart_name]}Renderer")
#       KK.log ChartConfig.const_defined?("#{config[:chart_name]}")
#       Charts.const_get("#{config[:chart_name]}Renderer")

#   end

#   def result_to_chart
#     size = 0
#     translations, results = nil
#     json = @chart_config.map do |config|
#       #chart_config = @chart_config.deep_merge(config)
      
#       results = chart_renderer_class(config).send(:new, config ,@response_set)
     
#       results
#     end
    
#     json
#   end


# end