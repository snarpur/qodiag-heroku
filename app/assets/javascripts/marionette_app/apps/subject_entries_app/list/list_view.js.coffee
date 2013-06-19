@Qapp.module "SubjectEntriesApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "subject_entries_app/list/list_layout"
    triggers:
      "click .btn.add-item"  : "add:item:clicked"
    ui:
      sendRequest : "a.add-item"
    
    regions:
      createItemRegion: "#create-item-region"
      entrySetSelectRegion: "#enty-set-select-region"
      entrySetSectionsRegion: "#entry-set-sections-region"
      entrySetValuesRegion: "#entry-set-values-region"


    initialize:->
      @entrySetSelectRegion.on "show",(view) => 
        if view.isEmpty()
          @ui.sendRequest.popover('show')

  

  

  class List.SelectItem extends App.Views.ItemView
    template: "subject_entries_app/list/_select_item"
    tagName: "option"
    templateHelpers: ->
      responseDetails:=>
       if @model.get('completed')
        "svarað: #{moment(@model.get('completed')).format('Do MMMM YYYY')}"
       else if moment().isSame(moment(@model.get('deadline')),'day')
         "skilafrestur rennur út ídag"
       else
        "skilafrestur: #{moment(@model.get('deadline')).fromNow()}"
         
    triggers:
      "click" : "select:response"



  


  class List.SelectItems extends App.Views.CompositeView
    template: "subject_entries_app/list/select_items"
    itemView: List.SelectItem
    tagName: "select"
    className: "span6"
    attributes:->
      'disabled' : => 'disabled' if @isEmpty()


    collectionEvents:
      "add" : "triggerAdd"
  
    triggerAdd:->
      @$el.removeAttr('disabled')


    appendHtml:(collectionView, itemView, index)->
      child = if itemView.model.get('completed') then 1 else 2
      @$("optgroup:nth-child(#{child})").append(itemView.el)

    isEmpty:->
      @collection.size() is 0

  


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
    className: "stepper"

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
    className: "entryset"


