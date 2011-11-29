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
    width =  @timeline.get('canvas_width') * (chart.size/@model.get('charts_size_total'))
    (width * 0.8) + 22

  dataLabelFormatter:=>
    () ->
      if @point.config.name? and @point.config.name.data_label
        @point.config.name.data_label
      else
        @.y

  legendFormatter:=>    
    accessCode = @timeline.getSurveyAccessCode(@model.get("survey_id"))
    () ->
      str = I18n.t("surveys.#{accessCode}.terms.#{@.name}")
      str = @.name if _.includes(str,'missing')
      _.capitalize(str)

  categoryFormatter:=>
    accessCode = @timeline.getSurveyAccessCode(@model.get("survey_id"))
    () ->
      str = I18n.t("surveys.#{accessCode}.terms.#{@.value}")
      str = @.value if _.includes(str,'missing')
      _.capitalize(str)


  plotOptions:(chart)=>
    _.extend(chart.plot_options.column.dataLabels,{formatter: @dataLabelFormatter()})
    chart.plot_options

  highChart:(chart)=>
      opt =
        tooltip: chart.tooltip
        credits: chart.credits
        title: chart.title
        chart:
          title: chart.chart.title
          renderTo: chart.name
          marginBottom: chart.chart.marginBottom
          height: @timeline.getChartHeight()
          type: chart.chart.type
        plotOptions: @plotOptions(chart)
        xAxis:
          categories: chart.categories
          title:
            text: chart.date
          labels: 
            formatter: @categoryFormatter()
        yAxis: chart.y_axis
        legend: _.extend(chart.legend, {labelFormatter: @legendFormatter()})
        series: chart.data

  
  renderChart:(chart)=>
    date = I18n.l("date.formats.long", new Date(@model.get("completed"))) if chart is @model.get("charts")[0]
    _.extend(chart, {date: date}) 
    chartEl = $(@template()(chart))
    chartEl.width(@chartWidth(chart))
    $(@el).append(chartEl)
    high = new Highcharts.Chart(@highChart(chart))
  
  renderCharts:=>
    _.each(@model.get('charts'), @renderChart)
  
  render:->
    @ 