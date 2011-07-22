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
     JST.bar_labels(label)

  inlineAttributes: =>
      attr =
          id:    @dialogId()
          class: @getElClass()
      attr

  chartConfig: ->
    console.log @model
    opt =
      legend:
        show:true
        placement: 'outsideGrid'
      seriesDefaults:
        renderer: $.jqplot.BarRenderer
        pointLabels:
          show: true
          edgeTolerance: 5
      series: @chart('data_labels')
      axes:
        xaxis:
          renderer: $.jqplot.CategoryAxisRenderer
          ticks: @barLabels()
          autoscale: true
        yaxis:
          min: 0
          ticks: @chart('increment')
    opt

  render: =>
    $(this.el).attr(@inlineAttributes())
    $(this.el).html(this.template()(@model.toJSON()))
    $("##{@dialogId()}").remove()
    $("#canvas").append(@el)
    @setPosition()
    plot = $.jqplot(@chartDivId(), _.values(@chart('data')), @chartConfig())
    console.log plot
    @expandLine()
    this