module ResponseSetChartRenderer
  module InstanceMethods
 
   def survey_class
      # REFACTOR: It could be a hole security (http://www.sitepoint.com/rails-security-pitfalls/)
      survey_name.underscore.camelize
   end
    
    
    def config_class(chart_type)
      eval("ChartConfig::#{survey_class}::#{chart_type.to_s.camelize}::Chart")
    end

    def response_to_chart(options={})
      if options[:column_metrics] == "standard_deviation"
        charts = get_chart_items(:standard_deviation).map do |item|
          config_copy = Marshal::load(Marshal.dump(item.get_config))
          item.get_renderer.send(:new, config_copy.merge(chart_metrics), self,options)
        end
      else
        charts = get_chart_items(:column).map do |item|
          config_copy = Marshal::load(Marshal.dump(item.get_config))
          item.get_renderer.send(:new, config_copy.merge(chart_metrics), self,options)
        end
      end
      
      if not chart_filters.nil? and not chart_filters[:chart_filters].nil?
        get_filter_options(chart_filters)
      end
     
      OpenStruct.new({:charts => charts}.merge(chart_metrics).merge(chart_filters))
    end

    def get_filter_options(chart_filters)
      chart_filters[:chart_filters].each do |filter|
        filter[:options] = Array.new()
        self.send("norm_reference_by_#{filter[:name]}_options", "parent").map do |norm|
          selected = (self.subject.age.to_i >= norm[:age_start].to_i && self.subject.age.to_i <= norm[:age_end].to_i) ||
            (self.subject.age.to_i >= norm[:age_start].to_i &&  norm[:age_end].nil?)
          filter[:options] << {:id => norm[:id], :value => norm.age_group_string, 
            :selected => selected ? "selected='selected'" : ""}
        end
      end
      chart_filters
    end

    def get_chart_items(chart_type)
      config_class(chart_type).send(:instance).get_items
    end

    def chart_metrics
      config_class(:column).send(:instance).get_config.slice(:chart_metrics)
    end

    def chart_filters
      config_class(:column).send(:instance).get_config.slice(:chart_filters)
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