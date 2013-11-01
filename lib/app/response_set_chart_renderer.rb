module ResponseSetChartRenderer
  module InstanceMethods
 
   def survey_class
      survey_name.underscore.camelize
   end
    
    
    def config_class(chart_type)
      eval("ChartConfig::#{survey_class}::#{chart_type.to_s.camelize}::Chart")
    end

    def response_to_chart(options={})
      if options[:column_metrics] == "standard_deviation"
        charts = get_chart_items(:standard_deviation).map do |item|
          config_copy = Marshal::load(Marshal.dump(item.get_config))
          item.get_renderer.send(:new, config_copy.merge(chart_metrics), self)
        end
      else
        charts = get_chart_items(:column).map do |item|
          config_copy = Marshal::load(Marshal.dump(item.get_config))
          item.get_renderer.send(:new, config_copy.merge(chart_metrics), self)
        end
      end

      OpenStruct.new({:charts => charts}.merge(chart_metrics))
      # OpenStruct.new({:charts => charts}.merge(chart_metrics).merge(chart_filters))
    end

    def get_chart_items(chart_type)
      config_class(chart_type).send(:instance).get_items
    end

    def chart_metrics
      config_class(:column).send(:instance).get_config.slice(:chart_metrics)
    end

    # def chart_filters
    #   filters = config_class(:column).send(:instance).get_config.slice(:chart_filters)
    #   filters[:chart_filters].each do |f|
    #     options = self.send("norm_reference_#{f[:name]}_options")
    #     f.merge!({:options => options})
    #   end
    #   filters
    # end
  
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