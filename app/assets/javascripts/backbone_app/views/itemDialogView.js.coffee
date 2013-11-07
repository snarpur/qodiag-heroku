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
    App.Event.on("drilldown", @setDrilldown)
    @line.on('change:currentChartHeight',@resizeDialog)
    @model.set({dialogView: @})

  
  template:->
    JST['backbone_app/templates/itemDialogTmpl']

  
  close:=>
    @line.set('currentChartHeight','')
    @line.trigger("updateDialog", null)
    App.Event.off("chartHeight")
    App.Event.off("drilldown")
    @line.off('change:currentChartHeight')
    @model.set({dialogView: null})

  
  setLineHeight:(height)=>
    if height? && height > App.Timeline.Dimensions.line_height_expanded
      @line.set('currentChartHeight',height)
    else
      @line.set('currentChartHeight','')

  
  resizeDialog:(line)=>
    @.$el.closest(".overlay-charts").css("height",line.get('currentChartHeight'))
    @.$el.css("height",line.get('currentChartHeight'))
    
  
  setDrilldown:(state)=>
    @.$el.setCssState(state, "drilldown")

  
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

  renderColumnCharts: =>
    charts = new App.Collections.ColumnChart([],{responderItem: @model})
    charts.fetch(
      success:(collection, response, options)->
        collection.reset(response.charts,{chartMetrics: response.chartMetrics, chartFilters: response.chartFilters})
        chartView = new App.Views.ColumnChartCollection({collection: collection})
        @.$(".chart-wrapper").append(chartView.render().el)
      error:(collection, xhr, options)->         
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