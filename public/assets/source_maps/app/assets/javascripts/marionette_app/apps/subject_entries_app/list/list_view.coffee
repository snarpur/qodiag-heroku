@Qapp.module "SubjectEntriesApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "subject_entries_app/list/list_layout"
    triggers:
      "click .btn.add-item"  : "add:item:clicked"
    ui:
      sendRequest : "a.add-item"
    
    regions:
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
    attributes:->
      "data-attribute-id":@model.get("id")

    events:
      'select' : 'triggerSelectResponse'

    triggerSelectResponse: (event)=>
      @trigger "select:response", @ unless not @model.get("completed")?
      

    templateHelpers: =>
      responseDetails:=>
       if @model.get('completed')
        I18n.t("terms.time_to_words.submitted") + ": #{moment(@model.get('completed')).format('Do MMMM YYYY')}"
       else if moment().isSame(moment(@model.get('deadline')),'day')
         I18n.t("responder_item.deadline") + " " + I18n.t("terms.time_to_words.expires") + " " + I18n.t("terms.today")
       else
        I18n.t("responder_item.deadline") + ": #{moment(@model.get('deadline')).fromNow()}"
         
 
  class List.SelectItems extends App.Views.CompositeView
    template: "subject_entries_app/list/select_items"
    itemView: List.SelectItem
    tagName: "select"
    className: "form-control"
    attributes:->
      'disabled' : => 'disabled' if @isEmpty()

    events:
      'change' : 'triggerSelectResponse'


    collectionEvents:
      "add" : "triggerAdd"


    triggerSelectResponse: (event)=>
      $(event.currentTarget.options[event.currentTarget.selectedIndex]).trigger("select")

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
      "click " : "set:current:section"


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
    tagName: "section"
    className: "panel"


    initialize: ->
      @model.set('entryValueRegionName',@entryValueRegionName())

    entryValueRegionName: ->
      "entry-value-region-#{@cid}"
 

  
  class List.EmptyEntry extends App.Views.ItemView
    template: "subject_entries_app/list/_section_empty"

  class List.Entries extends App.Views.CollectionView
    itemView: List.Entry
    emptyView: List.EmptyEntry

