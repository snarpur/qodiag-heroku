class AdhdRatingScaleChartRenderer < ChartRenderer

  @@chart_config = {  :chart_class => 'ColumnChart',
                      :default_plot_options => {
                       :column => {
                         :dataLabels => {
                           :enabled => 'true',
                           :color   => "#fff"
                    }}},
                      :default_chart_type => 'column',
                      :charts  => [
                        { :name => "score",
                          :question_groups => %w{inattention impulsivity_hyperactivity total},
                          :result_names  => %w{average}
                        }
                      ]
                   }


end
