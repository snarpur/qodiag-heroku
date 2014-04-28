@Qapp.module "EntryFieldsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "entry_fields/list/templates/list_layout"
    
    regions:
      settingsNavigationRegion: "#settings-navigation-region"
      listRegion: "#list-region"
      searchRegion: "#search-region"

  

  class List.EntryField extends App.Views.ItemView
    template: "entry_fields/list/templates/_entry_field"
    tagName: 'tr'
    
    triggers:
      'click a.edit' : 'edit:clicked'
      'click a.destroy' : 'destroy:clicked'

    modelEvents:
      'updated' : 'highlight'
      'created' : 'highlight'


    highlight:->
      @render()
      @$el.effect('highlight',{easing:'swing'},2000)
      


    
   

  
  class List.EntryFields extends App.Views.CompositeView
    template: "entry_fields/list/templates/entry_fields"
    itemView: List.EntryField
    itemViewContainer: 'tbody'


    triggers:
      "click a.button.prime": "create:field:clicked"


  class List.Search extends App.Views.ItemView
    template: "entry_fields/list/templates/_search"
    tagName: 'form'
    events:
      "keyup input": "setSearch"

    setSearch:(event)->
      @model.set("search",$(event.target).val())
  






