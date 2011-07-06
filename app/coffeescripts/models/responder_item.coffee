class App.Models.ResponderItem extends Backbone.Model
  urlRoot: "/ResponderItems"
  paramRoot: "responder_item"


class App.Collections.ResponderItemsCollection extends Backbone.Collection
  model: App.Models.ResponderItem
  url: '/responder_items'