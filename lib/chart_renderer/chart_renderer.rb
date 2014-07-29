module ChartRenderer
 class Chart
    include ChartMethods 
    attr_accessor :chart_data, :chart_size, :categories, :drilldown


    def initialize(chart_options,response_set,options={})
      @options = options
      @chart = chart_options
      @response_set = response_set
      @subject_series = subject_series
      @reference_values = reference_values
      
    end

    def norm_reference
      if not @options.nil? and not @options[:norm_reference_id].nil?
        norm_referenceee = NormReference.find @options[:norm_reference_id] unless (@options.nil? && @options[:norm_reference_id].nil?)
      else
        if @response_set.norm_reference.nil?
          norm_referenceee =  NormReference.get_norm_reference_for_oldest(@response_set[:survey_id],@response_set.subject.sex)
        else
          norm_referenceee = @response_set.norm_reference
        end
      end
      norm_referenceee
    end
    
    def access_code
      @response_set.survey_name
    end

    def get_content(item)
      @chart[:content][item.to_sym]
    end

    def subject_series
      {:name => @response_set.subject.full_name}.merge(subject_results)
    end

    def subject_results
      data= {}
      data[:data] = get_content(:question_groups).map do |i|
        groups = i.is_a?(String) ? i : i[:total]
        group_results = total_for_groups(groups)        
        if i.respond_to?(:has_key?) && i[:drilldown] == true
          config_drilldown(i, group_results)
          {:y => group_results, :drilldown => true, :name => i[:name] }
        else
          # {:y => group_results, :values => weights_by_groups(groups)}
          {:y => group_results}
        end
          
      end
      data
    end

    def reference_values
      series = norm_reference.scores_by_names_and_result_names(categories,get_content(:result_names)).map do |i|
        {:name => i[0], :data => i[1].map{|d| d.get_value}}
      end
      series
    end

    def norm_reference_group_name
      norm_reference.norm_reference_group_name
    end

    def chart_size
      get_content(:question_groups).size * 2
    end

    def chart_data
      @reference_values.reverse.insert(0,@subject_series)
    end

    def question_list_drilldown
      if @chart[:content][:question_list_drilldown]
        list = get_content(:question_groups).map do |i|
          i.is_a?(String) ? i : i[:total]
        end
        list.flatten
      end
    end

    def categories
      get_content(:question_groups).map do |i|
        i.is_a?(String) ? i : i[:name]
      end
    end
    
    def title
      unless @chart[:chart_config][:title][:text].nil?
        @chart[:chart_config][:title].merge({:text => norm_reference_group_name})
      end
    end


    def chart
      @chart[:chart_config][:chart][:renderTo] = get_content(:name)
      @chart[:chart_config][:chart]
    end
    
    def x_axis
      x_axis = @chart[:chart_config][:xAxis].deep_merge!({:categories => categories})
    end

    def subtitle   
      unless @chart[:chart_config][:subtitle][:text].nil?
        @chart[:chart_config][:subtitle].merge(:text => @response_set.completed_at) 
      end
    end

    def y_axis
      @chart[:chart_config][:yAxis]
    end

    def series
      chart_data
    end

    def credits
      @chart[:chart_config][:credits]
    end
    
    def tooltip
      @chart[:chart_config][:tooltip]
    end

    def legend
      @chart[:chart_config][:legend]
    end
    
    def plot_options
      @chart[:chart_config][:plotOptions]
    end
    
    def chart_metrics
      @chart[:content][:chart_metrics]
    end

    def chart_filters
      @chart[:content][:chart_filters]
    end


    def chart_output
      chart
      x_axis
      series
      title
      subtitle
      @chart[:chart_config]
    end
    
    def drilldown?
      @chart[:content][:question_groups].each do |i|
        if i.is_a? Hash
          return true if i.key?(:drilldown)
        end
      end
      return false

    end


    private
    def total_for_groups(groups)
      @response_set.sum_of_group_result(groups)
    end

    def x_config_drilldown(group, group_results)
      drilldown_config = Marshal::load(Marshal.dump(@chart)) 
      drilldown_config[:content][:question_groups] = group[:total]
      drilldown_chart = self.class.new(drilldown_config,@response_set)
      drilldown_series = [{:data => drilldown_chart.chart_data, :name => group[:name]}]
      {:y => group_results, :values => weights_by_groups(group), :drilldown => {:series => drilldown_chart.chart_data,:xAxis => {:categories => group[:total]}}}  
    end

    def config_drilldown(group, group_results)
      @drilldown ||= {}
      drilldown_config = Marshal::load(Marshal.dump(@chart)) 
      drilldown_config[:content][:question_groups] = group[:total]
      drilldown_chart = self.class.new(drilldown_config,@response_set)
      drilldown_group =  drilldown_chart.chart_data
      
      @drilldown[group[:name]] = {:series => drilldown_group,:xAxis => {:categories => group[:total]}}
    
    end    

    def weights_by_groups(groups)
      @response_set.weights_by_groups(groups)
    end
    
    def questions_by_group
      get_content(:question_groups).map do |i|
        groups = i.is_a?(String) ? i : i[:total]
      end
    end

    def subject_groups
      questions_by_group
    end

    def reference_groups
      total_for_custom_groups? ? get_content(:question_groups).stringify_keys.keys : get_content(:question_groups)
    end


    

  end
  %w{column stacked_column bar standard_deviation}.each {|c| require_dependency "#{c}.rb"} if Rails.env.development?
end