module ChartRenderer::Line
	class Chart < ChartRenderer::Chart

		def initialize(chart_options, response_sets)
			@chart = chart_options
			@response_sets = response_sets
			@groups = subject_groups
		end

		def data
			data = @response_sets.map do |set|
				set.results_with_total_for_current_groups(@groups)
			end
			data.transpose
		end

		def access_code
			@response_sets.first.survey_name
		end

		def series
			series = []
			data.each_with_index do |item,index|
				series << {:name => @groups[index], :data => item}	
			end
			@chart[:chart_config].merge!({:series => series})
		end

		def categories
			@response_sets.map do |r|
				r.completed_at
			end
		end

	  def chart_output
	  	categories
	  	series
	    x_axis = @chart[:chart_config][:xAxis]
	    x_axis.deep_merge!({:categories => categories})
	    @chart[:chart_config]
	    @chart[:chart_config]
		end
	end
end