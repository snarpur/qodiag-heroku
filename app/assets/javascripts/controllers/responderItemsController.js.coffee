class App.Controllers.ResponderItemsController extends Backbone.Router
  initialize: (options) ->
    @responder_items = new App.Collections.ResponderItemsCollection(options.responder_items)
    @timeline = new App.Models.Timeline(options.timeline)
  
  routes:
    "" : "index"

  index: ->
    canvasEl = $("#canvas")
    params = 
      collection: @responder_items
      model: @timeline
      el: canvasEl
    
    canvas = new App.Views.Timeline.Canvas(params)
    
    $("#canvas-p").append(canvas.render().el)
  

