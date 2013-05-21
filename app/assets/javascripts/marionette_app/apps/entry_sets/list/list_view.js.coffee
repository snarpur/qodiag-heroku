@Qapp.module "EntrySetsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  
  class List.EntrySet extends App.Views.ItemView
    template: "entry_sets/list/templates/_entrySet"
    tagName: "tr"
  
  class List.Empty extends App.Views.ItemView
    template: "entry_sets/list/templates/_empty"
    tagName: "tr"
  
  class List.EntrySets extends App.Views.CompositeView
    template: "entry_sets/list/templates/entrySets"
    tagName: 'table'
    className: 'table table-stiped table-bordered'
    itemView: List.EntrySet
    emptyView: List.Empty
    itemViewContainer: "tbody"