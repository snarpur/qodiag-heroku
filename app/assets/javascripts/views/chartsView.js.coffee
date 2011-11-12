App.Views.Charts ||= {}

class App.Views.Charts extends Backbone.View

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
    
    model = @model
    () ->
      str = I18n.t("surveys.#{model.get('access_code')}.terms.#{@.name}")
      console.log "surveys.#{model.get('access_code')}.terms.#{@.name}", model
      str = @.name if _.includes(str,'missing')
      _.capitalize(str)



  categoryFormatter:=>
    model = @model
    () ->
      model.get('translations')[@.value] ? @.value
      str = I18n.t("surveys.#{model.get('access_code')}.terms.#{@.value}")
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
          type: chart.chart.type
        plotOptions: @plotOptions(chart)
        xAxis:
          categories: chart.categories
          labels: 
            formatter: @categoryFormatter()
        yAxis: chart.y_axis
        legend: _.extend(chart.legend, {labelFormatter: @legendFormatter()})
        series: chart.data

  
  renderChart:(chart)=>
    chartEl = $(@template()(chart))
    chartEl.width(@chartWidth(chart))
    $(@el).append(chartEl)
    high = new Highcharts.Chart(@highChart(chart))
  
  renderCharts:=>
    _.each(@model.get('charts'), @renderChart)
  
  render:->
    @ 