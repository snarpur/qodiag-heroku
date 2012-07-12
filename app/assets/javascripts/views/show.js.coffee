App.Views.ResponderItems ||= {}

class App.Views.ResponderItems.Show extends Backbone.View

  template: ->
    return JST['show']

  elements: 
    {}

  events:
    "click .close" : "setDialogAsClosed"

  initialize:(item) =>
    @model.bind("change:openDialog", @remove)
    @el = $(@el)
    @model.view = @

  setDialogAsClosed:() =>
    console.info "SETTINGDIALOG AS CLOSED"
    @model.set(openDialog: false)
  
  remove:()=>
    if @model.get(openDialog) is false
      @dialog.empty()
      @contactLine()

  line:=>
    @elements.line ?= $("#line-#{@model.get('access_code')}")
    return @elements.line

  expandLine:=>
    @line().switchClass('closed','open', 1000 )

  contractLine: =>
    @line().switchClass('open','closed',1000 )

  chartDivId: =>
    "#{@model.get('access_code')}-chart"

  dialogId: =>
    "chart-dialog"

  dialog: =>
    $("##{@dialogId()}")

  dialogYPosition: =>
   "top: #{@line().position().top + @model.getTimeline('line_height')}px;"

  charts: (item) =>
    @model.get('charts')[item]

  getElClass: =>
    "chart-dialog"

  chartWidth:(chart) =>
    width =  @model.getTimeline('canvas_width') * (chart.size/@model.get('charts').size)
    (width * 0.8) + 22

  dataLabelFormatter: =>
    () ->
      if @point.config.name? and @point.config.name.data_label
        @point.config.name.data_label
      else
        @.y

  legendFormatter: =>
    model = @model
    () ->
      model.get('translations')[@.name] ? @.name

  categoryFormatter: =>
    model = @model
    () ->
      model.get('translations')[@.value] ? @.value

  plotOptions: (chart) =>
    _.extend(chart.plot_options.column.dataLabels,{formatter: @dataLabelFormatter()})
    chart.plot_options

  inlineAttributes: =>
      attr =
          id:    @dialogId()
          class: @getElClass()
          style: @dialogYPosition()
      attr

  highChart:(chart) =>
      opt =
        credits:
          enabled: false
        chart:
          title: chart.chart.title
          renderTo: chart.name
          marginBottom: chart.chart.marginBottom
          type: chart.chart.type
        tooltip:
          enabled: false
        plotOptions: @plotOptions(chart)
        xAxis:
          categories: chart.categories
          labels: 
            formatter: @categoryFormatter()
        series: chart.data
   
      opt['title'] = chart.title
      opt['yAxis'] = chart.y_axis if chart.y_axis?
      opt['legend'] = _.extend(chart.legend, {labelFormatter: @legendFormatter()})
      opt['width'] = @chartWidth(chart)
      _.extend(opt['xAxis'], chart.x_axis)
      opt
   
    renderChart: (chart) =>
      chart = chart
      $(this.el).append(JST['chart'](_.extend(chart, {width:@chartWidth(chart)})))
      high = new Highcharts.Chart(@highChart(chart))
   
    render: =>
      console.info @
      @model.set(openDialog: true)
      @expandLine()
      @el.attr(@inlineAttributes())
      @el.html(@template()(@model.toJSON()))
      $("#canvas").append(@el)
      @renderChart chart for chart in @model.get('charts')
      @
