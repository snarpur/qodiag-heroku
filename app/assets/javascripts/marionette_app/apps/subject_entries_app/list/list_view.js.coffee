@Qapp.module "SubjectEntriesApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "subject_entries_app/list/list_layout"
    
    regions:
      entrySetSelectRegion: "#enty-set-select-region"
      entrySetSectionsRegion: "#entry-set-sections-region"
      entrySetValuesRegion: "#entry-set-values-region"

  class List.SelectItem extends App.Views.ItemView
    template: "subject_entries_app/list/_select_item"
    tagName: "option"

    triggers:
      "click": "select:response"
 

  class List.SelectItems extends App.Views.CollectionView
    itemView: List.SelectItem
    tagName: "select"
    


  class List.Section extends App.Views.ItemView
    template: "subject_entries_app/list/_section"
    tagName: "li"
    className: ->
      "active"  if @model.collection.isCurrentSection(@model)

    triggers:
      "click a" : "set:current:section"
  


  class List.Sections extends App.Views.CollectionView
    itemView: List.Section
    tagName: "ul"
    className: "nav nav-tabs"

    initialize:->
      @on "childview:set:current:section", (view)->
        @collection.currentSectionId = view.model.id
        @collection.trigger("reset")



  class List.Entry extends App.Views.ItemView
    template: "subject_entries_app/list/_entry"
    tagName: "li"


    initialize: ->
      @model.set('entryValueRegionName',@entryValueRegionName())

    entryValueRegionName: ->
      # "entry-value-region-#{@model.get("entry_value").id}"
      "entry-value-region-#{@cid}"
 

  class List.Entries extends App.Views.CollectionView
    itemView: List.Entry
    tagName: 'ul'


