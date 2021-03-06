require 'singleton'
module ChartConfig
  
  CONFIG_PATH = "#{Rails.root}#{APP_CONFIG[:chart_config_path]}"
  
  class ChartItem
    def initialize(config)
      @config = config
    end

    def get_config
      @config
    end
    
    def chart_name
      @config[:chart_name]
    end 

    def chart_type
      @config[:chart_type]
    end
    
    def has_base_renderer?
      ChartRenderer.constants.include?(chart_name.to_sym) && ChartRenderer.const_get(chart_name.to_sym).constants.include?(:Chart)
    end
      
    def base_renderer
      ChartRenderer.const_get(chart_name.to_sym)
    end
    
    def has_type_renderer?(chart_type)
      return false if chart_type.nil?
      base_renderer.constants.include?(chart_type.to_sym)
    end

    def type_renderer
      base_renderer.const_get(chart_type.to_sym).const_get(:Chart)
    end

    def get_renderer
      if (has_base_renderer? && !has_type_renderer?(chart_type))
        base_renderer.const_get(:Chart)
      elsif has_base_renderer? && has_type_renderer?(chart_type)
        type_renderer
      else
        eval("ChartRenderer::#{@config[:extends]}::Chart")
      end 
    end
  end

  class Chart
    include Singleton
    def initialize
      @config ||= extend_config
      @items ||= process_chart
    end

    def get_config
      @config
    end

    def get_items
      @items
    end

    def get_config_file
      yml = YAML::load(File.open(config_file_path(self.class.name))).symbolize_all_keys!
    end
    
    def raw_config
      @raw_config ||= get_config_file
    end
    
    def config_file_path(chart_class)
      file_path = (chart_class.to_s.split('::') - ["ChartConfig"]).join("/").underscore
      "#{ChartConfig::CONFIG_PATH}/#{file_path}.yml"
    end
    
    def extend_config
      if raw_config[:extends]
        extended_config = self.class.superclass.instance.send(:get_config).deep_merge(raw_config)
        config = extended_config
      else
        config = raw_config
      end
      config
    end

    def process_chart
      if @config[:charts]
        @config[:charts].map do |c|
          default_config = @config.except(:charts)
          ChartConfig::ChartItem.new(default_config.deep_merge(c))
        end
      else
          ChartConfig::ChartItem.new(@config)
      end
    end
  end

  module Column
    class Chart < ChartConfig::Chart; end
  end
  
  module Bar
    class Chart < ChartConfig::Chart; end
  end
  

  module StackedColumn 
    class Chart < ChartConfig::Chart; end
  end

  module Line 
    class Chart < ChartConfig::Chart; end
  end

  module StandardDeviation
    class Chart < ChartConfig::Chart; end
  end
  
  module AdhdRatingScale 
    module Column
        class Chart < ChartConfig::Column::Chart;  end
    end
    module Line
      class  Chart < ChartConfig::Line::Chart;  end
    end
    module StandardDeviation
      class  Chart < ChartConfig::StandardDeviation::Chart;  end
    end
  end
  module Sdq
    module Column
        class  Chart < ChartConfig::StackedColumn::Chart;  end
    end
    module Line
      class  Chart < ChartConfig::Line::Chart;  end
    end
  end
  module YsrSyndromeScale
    module Column
        class  Chart < ChartConfig::StackedColumn::Chart;  end
    end
    module Line
      class  Chart < ChartConfig::Line::Chart;  end
    end
    module StandardDeviation
      class  Chart < ChartConfig::StandardDeviation::Chart;  end
    end
  end
  module Dass
    module Column
        class  Chart < ChartConfig::StackedColumn::Chart;  end
    end
    module Line
      class  Chart < ChartConfig::Line::Chart;  end
    end
  end
 
end