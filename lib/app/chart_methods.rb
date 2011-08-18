module ChartMethods

  def result_color(result_name)
    {:color => get(:color)[result_name.to_sym]}
  end

  def has_group_actions?
    !get(:group_actions).nil?
  end

  def group_value_for_opposite_result(group_name,result_name)
    @reference_values[index_of_opposite_result(result_name)][:data][group_index(group_name)]
  end

  def group_value_for_result(group_name,result_name)
    @reference_values[index_of_result(result_name)][:data][group_index(group_name)]
  end

  def name_of_opposite_result(result_name)
    get(:result_names)[index_of_opposite_result(result_name)]
  end

  def color_of_opposite_result(result_name)
    get(:color)[name_of_opposite_result(result_name).to_sym]
  end

  def color_of_result(result_name)
    get(:color)[result_name.to_sym]
  end

  def index_of_opposite_result(result_name)
    get(:result_names).reverse.index(result_name)
  end

  def index_of_result(result_name)
    get(:result_names).index(result_name)
  end

  def group_index(group)
    get(:question_groups).index(group.to_s)
  end
end