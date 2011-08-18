App.Views.ResponderItems ||= {}

class App.Views.ResponderItems.Show extends Backbone.View

  template: ->
    return JST['show']

  events:
    "click .close" : "remove"

  initialize:(item) =>
    @el = $(@el)
    @model.view = @

  elements: {}

  remove: =>
    @contractLine()
    @el.remove()

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

  setPosition: =>
    @el.css(top:@line().position().top + @model.getTimeline('line_height'))

  chart: (item) =>
    @model.get('chart')[item]

  getElClass: =>
    "chart-dialog"

  barLabels: =>
    @chart('bar_labels').map (label) ->
     label.name

  dataLabelFormatter:() =>
    pointLabels = @chart('point_labels')
    formatter:
      () ->
        console.log(@,"CHART FORMATTER")
        groupIndex = @.series.xAxis.categories.indexOf(@.x)
        resultNameIndex = @.series.index
        if resultNameIndex is 0
          return @.y
        else
          range = pointLabels[groupIndex].data[resultNameIndex - 1]
          return range


  plotOptions: () =>
    if @chart('plot_options')?
      _.extend(@chart('plot_options').column.dataLabels,@dataLabelFormatter())
    @chart('plot_options')

  inlineAttributes: =>
      attr =
          id:    @dialogId()
          class: @getElClass()
      attr

  highChart:(chart) ->
    console.info "HighChart Config", chart
    opt =
      chart:
        renderTo: chart.name
        type: chart.type
      plotOptions: chart.plot_options
      xAxis:
        categories: chart.bar_labels
        labels:
          align: left
          rotation: 30
      series: chart.data

  renderChart: (chart) =>
    chart = chart.chart
    $(this.el).append(JST['chart'](chart))
    new Highcharts.Chart(@highChart(chart))


  render: =>
    console.log "CHARTS-----", @model.get('charts')
    ##@remove()
    @el.attr(@inlineAttributes())
    @el.html(@template()(@model.toJSON()))
    $("#canvas").append(@el)
    @setPosition()
    @renderChart chart for chart in @model.get('charts')

    @expandLine()
    @

