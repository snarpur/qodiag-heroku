class ChartRenderer
  
  def initialize(response_set)
    @response_set = response_set
    get_chart_config
  end

  def get_chart_config
    @chart_config = YAML::load(File.open("#{Rails.root}#{APP_CONFIG['chart_config_path']}/#{@response_set.survey_name}.yml")).symbolize_all_keys!
  end

  def chart_class
    @chart_config[:chart_class].constantize
  end

  def result_to_chart
    size = 0
    translations = nil
    json = @chart_config[:charts].map do |config|
      chart_config = @chart_config[:defaults].deep_merge(config)
      results = chart_class.send(:new, chart_config ,@response_set)
      size += results.chart_size
      translations ||= results.translations
      chart = {:chart => {
                :data         => results.chart_data,
                :size         => results.chart_size,
                :categories   => results.categories
        }}
        if chart_config[:title][:text] == true
          chart_config[:title][:text] = results.norm_reference_group_name
        end
        chart_config.deep_merge(chart[:chart])

    end
    {:charts => json, :charts_size_total => size, :translations => translations }
  end

end