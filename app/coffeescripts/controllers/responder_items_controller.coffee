class App.Controllers.ResponderItemsController extends Backbone.Controller
  initialize: (options) ->
    console.log "in RI controller #{options.responder_items[0].name}"
    @responder_items = new App.Collections.ResponderItemsCollection(options)
    console.log @responder_items, "initialize controller"
  routes:
    ".*" : "index",
    "/:id": "show"

  show:(id) ->
    responder_item = @responder_items.get(id)
    @view = new App.Views.ResponderItems.View(model:responder_item)
    $("#responder_item").html(@view.render().el)

  index:(items) ->
    console.log "index CONTROLLER being called"
    @view = new App.Views.ResponderItems.Index(responder_items: @responder_items)
    console.log @view, "@view"
    $("#test-index").html(@view.render().el)
