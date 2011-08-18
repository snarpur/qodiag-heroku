class SdqChartRenderer < ChartRenderer

  @@chart_config = { :chart_class => 'StackedColumnChart',
                      :default_plot_options => {
                       :column => {
                         :stacking   => 'normal',
                         :dataLabels => {
                           :enabled => 'true',
                           :color   => "#fff"
                    }}},
                     :default_color => {:normal => '#6ddb00', :borderline => '#ffff00', :abnormal => "#e20000"},
                     :default_result_names => %w{normal borderline abnormal},
                     :default_chart_type => 'column',
                     :charts  => [
                         { :name            => "score",
                           :question_groups => %w{emotional conduct hyperactivity_inattention peer_problem prosocial_behaviour},
                           :group_actions => {:prosocial_behaviour => [:reverse_stack]}},
                         { :name            => "total",
                           :question_groups => {:total => %w{emotional conduct hyperactivity_inattention peer_problem prosocial_behaviour}}}
                         ]
                    }


  def initialize(response_set)
    super(response_set)
  end

  def point_data_labels
    labels = norm_reference.get_score_by_name(question_group_names).map do |score|
      label = {:name => score[0]}
      label[:data] = score[1].map{|d| d.get_range_values.uniq.join("-")}
      label[:data].reverse! unless label[:name].eql?('prosocial_behaviour')
      label
    end
    {:point_labels => labels}
  end

  def sdq_adjustments(values)
    series = []
    values.each do |i|
      color = color_for_result(i[:name])
      unless color.nil?
        series << reverse_stack(i).merge(:color => color)
      end
    end
    series
  end

end
