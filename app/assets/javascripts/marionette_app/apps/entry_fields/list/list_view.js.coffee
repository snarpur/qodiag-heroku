@Qapp.module "EntryFieldsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "entry_fields/list/templates/list_layout"
    className:"row"
    
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
      
    templateHelpers: =>
      type:=>
        switch @model.get("field_type")
          when "multi-choice" then "check-square-o"
          when "single-choice" then "dot-circle-o"
          else "font"

    

  
  class List.EntryFields extends App.Views.CompositeView
    template: "entry_fields/list/templates/entry_fields"
    itemView: List.EntryField
    itemViewContainer: 'tbody'

    triggers:
      "click .add-question": "create:field:clicked"

    ui:
      wrapper: 'div#entry_fields_wrapper'
      table: "table#entry_fields"


    onShow:()->
      @ui.table.dataTable
        'order': [[ 1, "asc" ]]
        'sDom': "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>"
        'sPaginationType': "bootstrap"
        'language':
          'url': "assets/data-tables/locales/" + I18n.locale + ".json"
        'aoColumnDefs': [
          {
            'bSortable': false
            'sClass': 'thin'
            'aTargets': [0]
          },
          {
            'bSortable': true
            'aTargets': [1]
          }
          ,
          {
            'bSortable': false
            'sClass': 'thin'
            'aTargets': [2]
          }
      ]

   
  class List.Search extends App.Views.ItemView
    template: "entry_fields/list/templates/_search"
    tagName: 'form'
    events:
      "keyup input": "setSearch"

    setSearch:(event)->
      @model.set("search",$(event.target).val())
  






