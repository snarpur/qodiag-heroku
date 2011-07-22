class App.Controllers.ResponderItemsController extends Backbone.Router
  initialize: (options) ->
    @current
    #@responder_items = options.responder_items #new App.Collections.ResponderItemsCollection(options)
    @responder_items = new App.Collections.ResponderItemsCollection(options.responder_items)
    @responder_items.initTimeline(options.timeline)

  routes:
    "" : "index",
    "responder_items/:id/": "show"

  show:(id) ->
    responder_item =  @responder_items.get(id:id)
    responder_item.fetch( success: (model,response) ->
                            params = model: model
                            show = new App.Views.ResponderItems.Show(params)
                            #show.dialog().remove()
                            show.render()
                          error: ->
                            console.log "error"
                        )


  index: ->
    new App.Views.ResponderItems.Index(responder_items: @responder_items)
