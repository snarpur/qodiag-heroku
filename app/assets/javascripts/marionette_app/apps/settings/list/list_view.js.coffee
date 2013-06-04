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
     

  class List.Breadcrumb extends App.Views.ItemView
    template: "settings/list/templates/breadcrumb"
    tagName: 'ul'
    className: 'breadcrumb'
    triggers:
      'click a' : "back"

  class List.Header extends App.Views.ItemView
    template: "settings/list/templates/header"
    className: 'content_title'
    tagName: "h1"

  class List.Navigation extends App.Views.CollectionView
    itemView: List.NavigationItem
    className: 'tabs fullwidth'
    tagName: 'ul'

