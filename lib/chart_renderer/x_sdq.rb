# #DEPRICATED: NOT USED

# class SdqChartRenderer < ChartRenderer


#   def initialize(response_set)
    
#     super(response_set)
#   end

#   def point_data_labels
#     KK.log "SDQ method 11"
#     labels = norm_reference.get_score_by_name(question_group_names).map do |score|
#       label = {:name => score[0]}
#       label[:data] = score[1].map{|d| d.get_range_values.uniq.join("-")}
#       label[:data].reverse! unless label[:name].eql?('prosocial_behaviour')
#       label
#     end
#     {:point_labels => labels}
#   end

#   def sdq_adjustments(values)
#     KK.log "SDQ method 2"
#     series = []
#     values.each do |i|
#       color = color_for_result(i[:name])
#       unless color.nil?
#         series << reverse_stack(i).merge(:color => color)
#       end
#     end
#     series
#   end

# end
