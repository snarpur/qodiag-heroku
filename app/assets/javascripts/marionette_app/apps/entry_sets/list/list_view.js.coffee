@Qapp.module "EntrySetsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "entry_sets/list/templates/list_layout"

    regions:
      settingsNavigationRegion: "#settings-navigation-region"
      listRegion: "#list-region"

  class List.EntrySet extends App.Views.ItemView
    template: "entry_sets/list/templates/_entry_set"
    tagName: "tr"
    triggers:
      "click a.destroy" : 'delete:entry:set'
  
  class List.Empty extends App.Views.ItemView
    template: "entry_sets/list/templates/_empty"
    tagName: "tr"
  
  class List.EntrySets extends App.Views.CompositeView
    template: "entry_sets/list/templates/entry_sets"
    itemView: List.EntrySet
    emptyView: List.Empty
    itemViewContainer: "tbody"

    triggers:
      'click .button.prime': 'create:entry:set'
