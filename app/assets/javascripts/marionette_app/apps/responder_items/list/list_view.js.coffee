@Qapp.module "ResponderItemsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "responder_items/list/templates/list_layout"
    
    regions:
      headerRegion: "#header-region"
      uncompleteItemsRegion: "#uncomplete-items-region"
      completeItemsRegion: "#complete-items-region"  
  
  class List.Item extends App.Views.ItemView
    template: "responder_items/list/templates/_item"
    tagName: 'tr'
    className: () ->
      if @model.get("completed")? then "success" else "warning"


  class List.Items extends App.Views.CompositeView
    template: "responder_items/list/templates/items"
    itemView: List.Item
    itemViewContainer: 'tbody'

    templateHelpers: =>
        tableTitle: =>
          I18n.t("responder_item.status.#{@options.status}")
          #@options.title

  class List.Header extends App.Views.ItemView
    template: "responder_items/list/templates/header"
    tagName: 'h1'
    className: 'content_title'

