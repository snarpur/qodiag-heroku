@Qapp.module "EntryFieldsSectionApp.Show", (Show, App, Backbone, Marionette, $, _) ->
  
  # class List.Layout extends App.Views.Layout
  #   template: "entrySets/list/templates/list_layout"
    
  #   regions:
  #     # panelRegion: "#panel-region"
  #     entrySetsRegion: "#entry-sets"
  
  # class List.Panel extends App.Views.ItemView
  #   template: "entrySets/list/templates/_panel"
  
  class Show.EntrySetSection extends App.Views.ItemView
    template: "entry_sets/show/templates/entrySetSection"

  
  class Show.EntrySet extends App.Views.CompositeView
    template: "entry_sets/list/templates/entrySet"
    itemView: Show.EntrySetSection
    itemViewContainer: "ul.entry-set-sections"