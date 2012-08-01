module ResponseSetChartRenderer
  module InstanceMethods

   def survey_class
      survey_name.underscore.camelize
    end
    
    def config_class(chart_type)
      eval("ChartConfig::#{survey_class}::#{chart_type.capitalize.to_s}::Chart")
    end

    def response_to_chart
      get_chart_items(:column).map do |item|
        config_copy = Marshal::load(Marshal.dump(item.get_config))
        item.get_renderer.send(:new, config_copy, self)
      end
    end


    def get_chart_items(chart_type)
      config_class(chart_type).send(:instance).get_items
    end
  
  end 
 

  module ClassMethods
    
    def responses_to_chart(response_sets)
      response_sets.first.get_chart_items(:line).map do |item|
        config_copy = Marshal::load(Marshal.dump(item.get_config))
        item.get_renderer.send(:new, config_copy, response_sets)
      end
       
     end 

  end 


end