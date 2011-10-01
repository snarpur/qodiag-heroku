class App.Controllers.ResponderItemsController extends Backbone.Router
  initialize: (options) ->
    @last_item
    @responder_items = new App.Collections.ResponderItemsCollection(options.responder_items)
    @timeline = @responder_items.initTimeline(options.timeline)

  routes:
    "" : "index"
    "responder_items/:id/": "show"
    "!": "closeOpenDialog"

  show:(id) ->
    
    responder_item =  @responder_items.get(id:id)
    responder_item.fetch( success: (model,response) =>
                            params = model: model
                            @timeline.showItemInDialog(@last_item,responder_item,params)
                          error: ->
                            console.log "error"
                        )
    @last_item = responder_item


  index: ->
    console.log "in index"
    new App.Views.ResponderItems.Index(responder_items: @responder_items)

  closeOpenDialog: =>
    console.info "in openClose"
    $("#chart-dialog").remove()
    $("#tml-history").find(".line.open").switchClass('open','closed',1000 )
