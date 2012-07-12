module ResponseSetChartRendererMethods

   def config_class
    ChartConfig.const_get(survey_name.underscore.camelize)
  end
  
  def get_chart_config
    config_class.send(:instance).get
  end

  def chart_renderer_class(config)
      chart_config_class = ChartConfig.const_get(config[:chart_name]).to_s.demodulize.to_sym
      if ChartRenderer.constants.include?(chart_config_class)
        ChartRenderer.const_get(chart_config_class)
      else
        ChartRenderer.const_get(config[:extends])
      end

  end

  def result_to_chart
    get_chart_config.map do |config|
      config_copy = Marshal::load(Marshal.dump(config))
      chart_renderer_class(config).send(:new, config_copy, self)
    end
  end


end