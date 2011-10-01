class App.Models.ResponderItem extends Backbone.Model
  urlRoot: "/responder_items"
  paramRoot: '/responder_items'

  getTimeline:(opt) =>
    @.collection.getTimeline(opt)

class App.Collections.ResponderItemsCollection extends Backbone.Collection
  model: App.Models.ResponderItem
  url: "/responder_items"
  # screen: {}
  openDialogModel: null
  initialize:() =>
    # @.bind("change:openDialog", @setOpenDialog, @)

  initTimeline:(timeline) ->
    @timeline = new App.Models.Timeline(timeline)
    new App.Views.Timeline.Nav(model: @timeline)

  getTimeline:(opt) =>
    @timeline.get(opt)
  
  setOpenDialog:(item) =>
    console.info "item.get(openDialog)", item.get('openDialog')
    console.info "openDialogModel", @.openDialogModel
    @.openDialogModel ?= item
    if item.get('openDialog') is true and @.openDialogModel isnt item
      @.openDialogModel.set(openDialog: false) 
      @.openDialogModel = item
      

    console.info "END openDialogModel",@.openDialogModel