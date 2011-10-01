class StackedColumnChart < ResultChart

  def initialize(chart_options,response_set)
    super(chart_options,response_set)
    @reference_values = set_group_actions
  end

  def reference_values
    series = norm_reference.get_score_by_name(reference_groups,:result_name).map do |i|
      group = {}
      group.merge!(:name  => i[0])
      group.merge!(:data  => data_values(i[1]))
      group.merge!(:stack => "reference_values")
      group.merge!(:color => color_of_result(i[0]))
    end
    series
  end

  def subject_series
    series = super
    series.merge(:stack => 'subject')
  end

  def set_group_actions
    return @reference_values unless has_group_actions?
    series = []
    @reference_values.each do |result|
      get(:group_actions).each_pair do |group,action|
        data = send(action.to_sym, result, group)
        series << result.merge(:data => data)
      end
    end
    series
  end

  def data_values(scores)
    scores.map{|s| {:y => s.get_value, :name=> {:data_label => s.get_range_values.join("-") }}}
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