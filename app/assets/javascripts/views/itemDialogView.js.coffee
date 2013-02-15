App.Views.Timeline ||= {}

class App.Views.Timeline.ItemDialog extends Backbone.View
  className: "line-overlay chart-dialog state-column"
  events:
    "click span.close": "close"
    "click span.line-chart-icn": "viewLineChart"
    "click span.column-chart-icn": "viewColumnChart"
  
  initialize:->
    @line = @options.line
    @timeline = @options.timeline
    App.Event.on("chartHeight", @setLineHeight)
    @line.on('change:currentChartHeight',@resizeDialog)
    @model.set({dialogView: @})

  template:->
    JST['templates/itemDialogTmpl']

  close:=>
    @line.trigger("updateDialog", null)
    App.Event.off("chartHeight")
    @model.set({dialogView: null})

  setLineHeight:(height)=>
    if height? && height > App.Timeline.Dimensions.line_height_expanded
      @line.set('currentChartHeight',height)
    else
      @line.set('currentChartHeight','')

  resizeDialog:(line)=>
    @.$el.css("height",line.get('currentChartHeight'))
    

  viewLineChart:=>
    $(@el).setCssState("line")
    if @.$(".line-chart").size() is 0
      @getLineChart()

  viewColumnChart:=>
    $(@el).setCssState("column")
  
  renderCharts:=>
    @model.fetch(
      success:(model,response)=>
        charts = new App.Views.Charts(item: model, timeline: @.options.timeline)
        @.$(".chart-wrapper").append(charts.render().el)
        charts.renderCharts()
      error:()->
          throw "could not get charts"
      )
  
  getLineChart:=>
    [id, subject_id] = [@line.get("survey_id"),@timeline.getSubjectId()]
    lineChart = new App.Models.LineChart({item: @model})
    that = @
    lineChart.fetch(
      success:(model,response) ->
        charts = new App.Views.LineCharts(model: model,timeline: that.timeline)
        @.$(".chart-wrapper").append(charts.render().el)
        charts.renderCharts()
      error:(response)->
    )

  render:->
    $(@el).html(@template()(@model.toJSON()))
    @