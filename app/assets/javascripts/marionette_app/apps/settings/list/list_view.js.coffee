@Qapp.module "SettingsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "settings/list/templates/list_layout"
    
    regions:
      navigationRegion: "#navigation-region"

    
  class List.NavigationItem extends App.Views.ItemView
    template: "settings/list/templates/_navigation"
    tagName: 'li'
    className: ->
      if @model.collection.currentSetting == @model.get('name')
        "active"

  class List.Header extends App.Views.ItemView
    template: "settings/list/templates/header"
    className: "feature-head text-center"

  class List.Navigation extends App.Views.CollectionView
    itemView: List.NavigationItem
    className: 'tabs fullwidth'
    tagName: 'ul'

