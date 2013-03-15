module ChartRenderer
 class Chart
    include ChartMethods 
    attr_accessor :chart_data, :chart_size, :categories


    def initialize(chart_options,response_set)
      @chart = chart_options
      @response_set = response_set
      @subject_series = subject_series
      @reference_values = reference_values
    end

    def norm_reference
      return if @response_set.norm_reference.nil?
      @response_set.norm_reference
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
          drilldown_config = Marshal::load(Marshal.dump(@chart)) 
          drilldown_config[:content][:question_groups] = groups 
          drilldown_chart = self.class.new(drilldown_config,@response_set)
          drilldown_series = [{:data => drilldown_chart.chart_data, :name => i[:name]}]
          {:y => group_results, :drilldown => {:series => drilldown_chart.chart_data,:xAxis => {:categories => groups}}}
        else
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
      # x_axis.deep_merge!({:categories => categories})
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
      # @chart[:chart_config][:series] = chart_data
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



    def chart_output
      chart
      x_axis
      series
      title
      subtitle
      @chart[:chart_config]
    end

    private
    def total_for_groups(groups)
      @response_set.sum_of_group_result(groups)
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

    def drilldown?
      get_content(:drilldown)
    end
    

  end
  %w{column adhd_rating_scale stacked_column bar standard_deviation}.each {|c| require_dependency "#{c}.rb"} if Rails.env.development?
end