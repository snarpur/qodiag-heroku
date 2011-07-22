class App.Models.ResponderItem extends Backbone.Model
  urlRoot: "/responder_items"
  paramRoot: '/responder_items'

  getTimeline:(opt)=>
    @.collection.getTimeline(opt)


class App.Collections.ResponderItemsCollection extends Backbone.Collection
  model: App.Models.ResponderItem
  url: "/responder_items"
  screen: {}

  initTimeline:(timeline) ->
    @timeline = new App.Models.Timeline(timeline)
    new App.Views.Timeline.Nav(model: @timeline)

  getTimeline:(opt)=>
    @timeline.get(opt)




