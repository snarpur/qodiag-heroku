@Qapp.module "SettingsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "settings/list/templates/list_layout"
    
    regions:
      navigationRegion: "#navigation-region"
      settingsContentRegion: "#setting-content-region"
    
    
  class List.NavigationItem extends App.Views.ItemView
    template: "settings/list/templates/_navigation"
    tagName: 'li'

  class List.Navigation extends App.Views.CollectionView
    itemView: List.NavigationItem
    className: 'nav nav-tabs'
    tagName: 'ul'
  
  class List.Setting extends App.Views.ItemView
    template: "settings/list/templates/setting"
