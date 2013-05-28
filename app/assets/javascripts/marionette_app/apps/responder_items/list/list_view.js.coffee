@Qapp.module "ResponderItemsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  # class List.Layout extends App.Views.Layout
  #   template: "patient_home/list/templates/list_layout"
    
  #   regions:
  #     navigationRegion: "#navigation-region"
  #     settingsContentRegion: "#setting-content-region"
    
    
  class List.Item extends App.Views.ItemView
    template: "responder_items/list/templates/_item"
    tagName: 'tr'

    itemLink:->
      "sls"
     


  class List.Items extends App.Views.CompositeView
    template: "responder_items/list/templates/items"
    itemView: List.Item
    itemViewContainer: 'tbody'

