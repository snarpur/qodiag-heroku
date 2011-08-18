class ChartRenderer

  def initialize(response_set)
    @response_set = response_set
    get_chart_config
    KK.log ap @chart_config
  end

  def get_chart_config
    @chart_config = YAML::load(File.open("#{Rails.root}#{APP_CONFIG['chart_config_path']}/#{@response_set.survey_name}.yml")).symbolize_all_keys!
  end

  def chart_class
    @chart_config[:chart_class].constantize
  end

  def chart_defaults
    defaults = {}
    @chart_config.each_pair do |k,v|
      if k.to_s.starts_with?('default')
        defaults[k.to_sym] = v
      end
    end
    defaults
  end

  def result_to_chart
    json = @chart_config[:charts].map do |chart|
      chart_config = @chart_config.except(:charts).merge(chart)
      results = chart_class.send(:new, chart_config ,@response_set)
      { :chart => {
          :name         => results.get(:name),
          :type         => results.get(:chart_type),
          :data         => results.chart_data,
          :bar_labels   => results.categories,
          :plot_options => results.get(:plot_options)
        }}
    end
    {:charts => json}
  end

end