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
    @model.set({dialogView: @})

  template:->
    JST['templates/itemDialogTmpl']

  close:=>
    @line.trigger("updateDialog", null)
    @model.set({dialogView: null})

  viewLineChart:=>
    $(@el).setCssState("line")
    if @.$(".line-chart").size() is 0
      @getLineChart()

  viewColumnChart:=>
    $(@el).setCssState("column")
  
  renderCharts:=>
    @model.fetch(
      success:(model,response)=>
        charts = new App.Views.Charts(model: model, timeline: @.options.timeline)
        @.$(".chart-wrapper").append(charts.render().el)
        charts.renderCharts()
      error:->
        console.log "error"
      )
  
  getLineChart:=>
    [id, subject_id] = [@line.get("survey_id"),@timeline.get("subject").id]
    lineChart = new App.Models.LineChart({id: id, subject_id: subject_id})
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