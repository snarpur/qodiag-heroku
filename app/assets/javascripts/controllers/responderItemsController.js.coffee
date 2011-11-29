class App.Controllers.ResponderItemsController extends Backbone.Router
  initialize: (options) ->
    @responder_items = new App.Collections.ResponderItemsCollection(options.responder_items)
    @timeline = new App.Models.Timeline(options.timeline)
    #@responder_items.setTimeline(@timeline)
  
  routes:
    "" : "index"

  index: ->
    canvasEl = $("#canvas")
    params = 
      collection: @responder_items
      model: @timeline
      el: canvasEl
    
    canvas = new App.Views.Timeline.Canvas(params)
    #$("#content").append(canvas.render().el)
    $("#canvas-p").append(canvas.render().el)
  
  closeOpenDialog: =>
    console.info "in openClose"
    $("#chart-dialog").remove()
    $("#tml-history").find(".line.open").switchClass('open','closed',1000 )
