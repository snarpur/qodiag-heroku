module ChartRenderer::StackedColumn 
class Chart < ChartRenderer::Column::Chart

  def initialize(chart_options,response_set)
    super(chart_options,response_set)
    @reference_values = set_group_actions
  end

  def reference_values
    ordered_series = []
    series = norm_reference.scores_by_names_and_result_names(categories,get_content(:result_names))
    series.each do |i|
      group = {}
      group.merge!(:name  => i[0])
      group.merge!(:data  => data_values(i[1]))
      group.merge!(:stack => "reference_values")
      group.merge!(:color => color_of_result(i[0]))
      ordered_series[index_of_result(i[0])] = group
    end
    ordered_series
  end

  def subject_series
    series = super
    series.merge(:stack => 'subject')
  end

  def set_group_actions
    return @reference_values unless has_group_actions?
    series = []
    @reference_values.each do |result|
      get_content(:group_actions).each_pair do |group,action|
        data = send(action.to_sym, result, group)
        series << result.merge(:data => data)
      end
    end
    series
  end

  def data_values(scores) 
    data = []
    scores.each do |s|
      data[categories.index(s.name)] = {:y => s.get_value, :name=> {:data_label => data_label(s)}}
    end
    data
  end

  def data_label(score)
    if score.is_range_value?
      format_range_value(score)
    else
      score.value
    end    
  end

  def format_range_value(score)
    score.get_range_values.map{|s| s.floor == s ? s.to_i : s }.join("-")
  end

  def reverse_stack(result, group)
    data = result[:data].clone
    data[group_index(group)] = {
      :y =>      group_value_for_opposite_result(group,result[:name])[:y],
      :color =>  color_of_opposite_result(result[:name]),
      :name =>   group_value_for_opposite_result(group,result[:name])[:name]
    }
    data
  end

end
end
