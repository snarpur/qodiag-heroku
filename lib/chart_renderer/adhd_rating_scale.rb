  # encoding: utf-8 
module ChartRenderer::AdhdRatingScale 
  module Column
    class Chart < ChartRenderer::Column::Chart
    	
    	def initialize(chart_options,response_set)
        super(chart_options,response_set)

      end

      def reference_values
        series = super
        series.first.merge!({:tooltip => standard_deviation_from_average(series.first[:data])})
        series
    	end
      
      def subject_series
    		series = super
    		series.merge({:tooltip => count_high_values})
      end

      #REFACTOR: Remove localized strings
      def count_high_values
      	groups = subject_groups - ["total"]
      	tooltip_object = {:heading => "Fjöldi 2/3: ", :content => {:total =>[0,0]}}
      	groups.each do |g|
          result = tooltip_object[:content]
      		count = @response_set.count_results_by_group_and_weight([2,3],g)
      		total = @response_set.count_results_by_group(g)
      		result[g.to_sym] = "#{count} af #{total}"
          result[:total][0] += count
          result[:total][1] += total
          if groups.last == g
            result[:total] = result[:total].join(" af ")
          end 
      	end
      	tooltip_object
      end

      #REFACTOR: Remove localized strings
      def standard_deviation_from_average(data)
      	groups = subject_groups
    		standard_deviation = norm_reference.get_score_by_result_name('standard_deviation').map do |i|
           i[1].map{|d| d.get_value}
        end
        result = [subject_results[:data], data, standard_deviation.flatten].transpose
      	tooltip_object = {:heading => "S frá M ", :content => {}}
      	result.each_index do |r|
      		tooltip_object[:content][groups[r]] = ((result[r][0] - result[r][1]) / result[r][2]).round(2)
      	end
      	tooltip_object
      end


    end
  end
end