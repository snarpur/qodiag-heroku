module TimelineHelper

  def dimensions(timeline)
    sass_variables = ""
    timeline.dimensions.each do |d|
      sass_variables << "$#{d.first}: #{d.last}px\n"
    end
    sass_variables
  end

end