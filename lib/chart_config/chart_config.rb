require 'singleton'
module ChartConfig
  
  CONFIG_PATH = "#{Rails.root}#{APP_CONFIG['chart_config_path']}"
  

  def ChartConfig.get(chart_class)
    filename = "#{chart_class.demodulize.underscore}.yml"
    yml = YAML::load(File.open("#{ChartConfig::CONFIG_PATH}/#{filename}")).symbolize_all_keys!
    ChartConfig.extend_config(yml)
  end

  def ChartConfig.extend_config(chart_config)
    config = {}
    if chart_config[:extends]
      extended_config = eval("ChartConfig::#{chart_config[:extends]}.instance").send(:get).deep_merge(chart_config)
      config = extended_config
    else
      config = chart_config
    end
    config
  end
  
  class Column
    include Singleton
    def initialize
      @config ||= process_chart(ChartConfig.get(self.class.name))
    end
    def process_chart(config)
      if config[:charts]
        config[:charts].map do |c|
          default_config = config.except(:charts)
          chart = default_config.deep_merge(c)
        end
      else
          config
      end
    end

    def get
      @config
    end
  end
  
  class StackedColumn < Column  
  end
  
  class AdhdRatingScale < Column  
  end

  class Sdq < StackedColumn
  end


end