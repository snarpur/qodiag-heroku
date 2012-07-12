class Charts::LineChart < Charts::ResultChart

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

	def series
		series = []
		data.each_with_index do |item,index|
			series << {:name => @groups[index], :data => item}	
		end
		series
	end

	def categories
		@response_sets.map do |r|
			r.completed_at
		end
	end

end