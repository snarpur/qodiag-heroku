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
      {:name => @response_set.subject.full_name }.merge(subject_results)
    end

    #IMPORTANT: refactor drilldown into method of class
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
          # drilldown = ChartRenderer::Drilldown::Chart.new(@response_set,groups,[group_results])
          # drilldown.series_with_drill_down
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
      #START: Add question group_ids to json output the fetch question list in xhr request
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
        @chart[:chart_config][:title][:text] = norm_reference_group_name
      end
    end

    def chart_settings
      @chart[:chart_config][:chart][:renderTo] = get_content(:name)
    end
    
    def x_axis_settings
      x_axis = @chart[:chart_config][:xAxis]
      x_axis.deep_merge!({:categories => categories})
    end

    def subtitle
      unless @chart[:chart_config][:subtitle][:text].nil?
        @chart[:chart_config][:subtitle][:text] = @response_set.completed_at
      end
    end

    def y_axis_settings
      @chart[:chart_config][:yAxis]
    end

    def series
      @chart[:chart_config][:series] = chart_data
    end

    def chart_output
      chart_settings
      x_axis_settings
      series
      title
      subtitle
      @chart[:chart_config]
    end

    private
    # def total_for_custom_groups?
    #   get_content(:question_groups).is_a?(Hash) && get_content(:question_groups).has_key?(:total)
    # end

    def total_for_groups(groups)
      @response_set.sum_of_group_result(groups)
    end

    
    def questions_by_group
      get_content(:question_groups).map do |i|
        groups = i.is_a?(String) ? i : i[:total]
      end
    end
    # def results_with_total_for_current_groups
    #   total = subject_groups.select{|g| g == "total"}
    #   groups = subject_groups - total
    #   data = groups.map{|g| @response_set.sum_of_group_result(g)}
    #   data << data.sum unless total.empty?
    #   data
    # end

    def subject_groups
      total_for_custom_groups? ? get_content(:question_groups).values.flatten : get_content(:question_groups)
    end

    def reference_groups
      total_for_custom_groups? ? get_content(:question_groups).stringify_keys.keys : get_content(:question_groups)
    end

    def drilldown?
      get_content(:drilldown)
    end
    
    def drilldown_results
      responses = @response_set.group_result(subject_groups)
      drilldown = []
      responses.each do |i|
        index = subject_groups.index(i.question.question_group.text)
        drilldown[index] ||= []
        drilldown[index] <<  {:y => i.answer.weight, :name => i.question.display_order}
      end
      drilldown
    end

  end
  %w{column adhd_rating_scale stacked_column bar}.each {|c| require_dependency "#{c}.rb"} if Rails.env.development?
end