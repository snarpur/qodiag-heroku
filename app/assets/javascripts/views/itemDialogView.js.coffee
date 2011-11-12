App.Views.Timeline ||= {}

class App.Views.Timeline.ItemDialog extends Backbone.View
  className: "line-overlay chart-dialog"
  events:
    "click span.close": "close"
  
  initialize:->
    @line = @options.line
    @timeline = @options.timeline
    @model.set({dialogView: @})

  template:->
    JST['templates/itemDialogTmpl']

  close:=>
    @line.trigger("updateDialog", null)
    @model.set({dialogView: null})

  renderCharts:=>
    @model.fetch(
      success:(model,response)=>
        charts = new App.Views.Charts(model: model, timeline: @.options.timeline)
        $(@el).append(charts.render().el)
        charts.renderCharts()

      error:->
        console.log "error"
      )
  
  render:->
    $(@el).html(@template()(@model.toJSON()))
    @