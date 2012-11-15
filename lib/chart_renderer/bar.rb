module ChartRenderer::Bar
class Chart < ChartRenderer::Chart

  def initialize(chart_options,response_set)
    KK.log "in Bar"
    super(chart_options,response_set)
  end

end
end