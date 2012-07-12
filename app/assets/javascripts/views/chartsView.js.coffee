#TODO:: clean up formatters

App.Views.Charts ||= {}

class App.Views.Charts extends Backbone.View
  
  className: "column-chart"

  initialize:->
    @timeline = @.options.timeline
  
  template:->
    JST['templates/chartsTmpl']

  charts: (item) =>
    @model.get('charts')[item]

  chartWidth:(chart)=>
    total_size = 0
    _.each(@model.get('charts'), (n)->
      total_size += n.size
    )
    width =  @timeline.get('canvas_width') * (chart.size/total_size)
    (width * 0.8) + 22



  chartFormatters:(formatter) =>
    view =  @
    accessCode = view.timeline.getSurveyAccessCode(view.model.get("survey_id"))
    formatters =
      dataLabels:()->
        if @point.config.name? and @point.config.name.data_label
          @point.config.name.data_label
        else
          @.y
      
      categoryLabels:()->
        str = I18n.t("surveys.#{accessCode}.terms.#{@.value}")
        str = @.value if _.includes(str,'missing')
        _.capitalize(str)

      legendLabels: () ->
        str = I18n.t("surveys.#{accessCode}.terms.#{@.name}")
        str = @.name if _.includes(str,'missing')
        _.capitalize(str)

      tooltip:()->
        str = ""
        _.each(@.points, (p) ->
          console.log @, p
          str += "<span style=text-align:center;color:#eaeaea;font-size:14px;font-weight:bold;text-decoration:underline;>#{p.series.tooltipOptions.heading}</span>"
          str += "<br/>"
          str +=  "  <span style=text-align:center;color:#fcf9ae;background-color: #999999;>#{p.series.tooltipOptions.content[p.x]}</span>"
          str += "<br/><br/>"
        )
        str

    formatters["#{formatter}"] if formatter


  setFormatters:(chart)=>
    type = chart.type
    view = @
    formatters =
      dataLabels:
        {formatterParent: chart.plotOptions["#{chart.chart.type}"].dataLabels, formatterKey: "formatter"}
      categoryLabels:
        {formatterParent: chart.xAxis.labels, formatterKey: "formatter"}
      legendLabels:
        {formatterParent: chart.legend, formatterKey: "labelFormatter"}
      tooltip:
        {formatterParent: chart.tooltip, formatterKey: "formatter"}

      
    _.each(formatters, (v,k)->
      v.formatterParent["#{v.formatterKey}"] = view.chartFormatters(k)
    )


  renderChart:(chart)=>
    console.log chart
    chartEl = $(@template()(chart))
    @setFormatters(chart)
    chartEl.width(@chartWidth(chart))
    $(@el).append(chartEl)
    high = new Highcharts.Chart(chart)

  
  renderCharts:=>
    _.each(@model.get('charts'), @renderChart)
  
  render:->
    @