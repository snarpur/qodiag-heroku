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

  def subject_result
    series = super
    set_group_stack(series,"subject")
  end

  def set_group_stack(series, stack)
    stack = {:stack => stack}
    if series.is_a?(Array)
      series.each{|s| s.merge!(stack)}
    else
      series.merge!(stack)
    end
    series
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
    scores.map{|s| s.get_value}
  end

  def reverse_stack(result, group)
    data = result[:data].clone
     data[group_index(group)] = {
      :y =>      group_value_for_opposite_result(group,result[:name]),
      :color =>  color_of_opposite_result(result[:name]),
      :name =>   name_of_opposite_result(result[:name])
    }
    data
  end

  # def has_group_actions?
  #   !get(:group_actions).nil?
  # end
  #
  # def group_value_for_opposite_result(group_name,result_name)
  #   KK.log "group_name #{group_name}"
  #   KK.log "result_name #{result_name}"
  #   KK.log "group_index(group_name) #{group_index(group_name)}"
  #   KK.log "color_of_opposite_result(result_name) #{color_of_opposite_result(result_name)}"
  #   KK.log "@reference_values #{@reference_values.inspect}"
  #   KK.log "@reference_values[index_of_opposite_result(result_name)] #{@reference_values[index_of_opposite_result(result_name)]}"
  #
  #   @reference_values[index_of_opposite_result(result_name)][:data][group_index(group_name)]
  # end
  #
  # def group_value_for_result(group_name,result_name)
  #   @reference_values[index_of_opposite_result(result_name)][group_index(group_name)]
  # end
  #
  # def name_of_opposite_result(result_name)
  #   get(:result_names)[index_of_opposite_result(result_name)]
  # end
  #
  # def color_for_opposite_result(result_name)
  #   get(:colors)[name_of_opposite_result(result_name).to_sym]
  # end
  #
  # def color_for_result(result_name)
  #   get(:color)[result_name.to_sym]
  # end
  #
  # def index_of_opposite_result(result_name)
  #   get(:result_names).reverse.index(result_name)
  # end
  #
  # def index_of_result(result_name)
  #   get(:result_names).index(result_name)
  # end
  #
  # def group_index(group)
  #   get(:question_groups).index(group.to_s)
  # end
end