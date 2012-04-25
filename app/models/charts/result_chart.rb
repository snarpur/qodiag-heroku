class ResultChart
  include ChartMethods 

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

  def get(item)
    @chart[item].nil? ? get_defaults(item) : @chart[item]
  end

  def subject_series
    { :name => @response_set.subject.full_name,
      :data => subject_results }
  end

  def subject_results
    if total_for_custom_groups?
     data = total_for_custom_groups
    else
      data = results_with_total_for_current_groups
    end
  end

  def reference_values
    series = norm_reference.get_score_by_result_name(get(:result_names)).map do |i|
      {:name => i[0], :data => i[1].map{|d| d.get_value}}
    end
  end

  def norm_reference_group_name
    norm_reference.norm_reference_group_name
  end

  def chart_size
    reference_groups.size * 2
  end

  def chart_data
    @reference_values.reverse.insert(0,subject_series)
  end

  def categories
    reference_groups
  end

  def translations
    I18n.t("surveys.#{norm_reference.survey.access_code}.terms")
  end

  private
  
  def get_defaults(key)
    @chart["#{:default}_#{key}".to_sym]
  end

  def total_for_custom_groups?
    get(:question_groups).is_a?(Hash) && get(:question_groups).has_key?(:total)
  end

  def total_for_custom_groups
    @response_set.group_result(subject_groups)
  end

  def results_with_total_for_current_groups
    total = subject_groups.select{|g| g == "total"}
    groups = subject_groups - total
    data = groups.map{|g| @response_set.group_result(g)}
    data << data.sum unless total.empty?
    data
  end

  def subject_groups
    total_for_custom_groups? ? get(:question_groups).values.flatten : get(:question_groups)
  end

  def reference_groups
    total_for_custom_groups? ? get(:question_groups).stringify_keys.keys : get(:question_groups)
  end
  
  # def get_series_options(series_name)
  #   unless @chart[:result_options].nil?
  #     options = @chart[:result_options][series_name.to_sym]
  #     options ||= {}
  #   end
  # end

end