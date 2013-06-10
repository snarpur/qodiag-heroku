@Qapp.module "ResponderItemsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
    
  class List.Item extends App.Views.ItemView
    template: "responder_items/list/templates/_item"
    tagName: 'tr'


  class List.Items extends App.Views.CompositeView
    template: "responder_items/list/templates/items"
    itemView: List.Item
    itemViewContainer: 'tbody'

  class List.Header extends App.Views.ItemView
    template: "responder_items/list/templates/header"
    tagName: 'h1'
    className: 'content_title'

