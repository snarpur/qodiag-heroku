module ChartRenderer::StandardDeviation
class Chart < ChartRenderer::Chart

  BELL_CURVE = 9
  def initialize(chart_options,response_set)
    super(chart_options,response_set)
  end

  
  def reference_values
    [
      {:name => "a", :data => [nil,nil,nil,8.5,11,8.5,nil,nil,nil]},
      {:name => "b", :data => [nil,nil,1.5,8.5,nil,8.5,1.5,nil,nil]},
      {:name => "c", :data => [nil,0.2,1.5,nil,nil,nil,1.5,0.2,nil]},
      {:name => "c", :data => [0,0.2,nil,nil,nil,nil,nil,0.2,0]}
    ]
  end

  def categories
    [-4,-3,-2,-1,0,1,2,3,4]
  end

  def subject_series
    series = super
    queries = @chart[:chart_metrics].group_by{|d| d[:name] }

    question_groups = get_content(:question_groups).map{|i| i.is_a?(String) ? i : i[:name]}

    reference = norm_reference.scores_by_names_and_result_names(question_groups,queries.values.map{|q| q[0][:query]})
    center = (BELL_CURVE - 1)/2
    data = []
    
    series[:data].each_with_index do |item,index|
      
      average = reference[queries['average'][0][:query]].select{|i| i.name == question_groups[index]}.first
      standard_deviation = reference[queries['standard_deviation'][0][:query]].select{|i| i.name == question_groups[index]}.first
      average_value = average.end_value.nil? ? average.value : average.end_value
      
      sd_value = -((item[:y] - average_value)/ standard_deviation.value)
      x_axis = center + sd_value
     
      data << {:name => {:name => question_groups[index],:value => sd_value.round(2)}, :type => 'scatter', :data =>[[x_axis,index+1]]}
    end

    data    
  end  

  def chart_data
    @reference_values + @subject_series
  end

end
end