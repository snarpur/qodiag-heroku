class ColumnChart < ResultChart

  def initialize(chart_options,response_set)
    super(chart_options,response_set)
  end

  def reference_values
    series = norm_reference.get_score_by_result_name(get(:result_names)).map do |i|
      {:name => i[0], :data => i[1].map{|d| d.get_value}}
    end
  end

end