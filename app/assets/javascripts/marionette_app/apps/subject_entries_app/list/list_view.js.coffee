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
 

  class List.SelectItems extends App.Views.CollectionView
    itemView: List.SelectItem
    tagName: "select"
    


  class List.Section extends App.Views.ItemView
    template: "subject_entries_app/list/_section"
    tagName: "li"
    className: ->
      "active"  if @model.isCurrentSection()

    initialize:->
      console.log @
      itemViewOptions = _.omit(@options,'model')
      console.log "itemViewOptions", itemViewOptions
      unless _.isEmpty(itemViewOptions)
        helpers = @templateHelpers()
        _.each(itemViewOptions,((v,k)->
          console.warn v,k
          helpers[k] = () -> _.result(v)
          ),@)
        @templateHelpers = ()-> helpers

      console.log helpers

  class List.Sections extends App.Views.CollectionView
    itemView: List.Section
    tagName: "ul"
    className: "nav nav-tabs"



  class List.Entry extends App.Views.ItemView
    template: "subject_entries_app/list/_entry"
    tagName: "li"


    initialize: ->
      @model.set('entryValueRegionName',@entryValueRegionName())

    entryValueRegionName: ->
      "entry-value-region-#{@model.get("entry_value").id}"
 

  class List.Entries extends App.Views.CollectionView
    itemView: List.Entry
    tagName: 'ul'


