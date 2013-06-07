@Qapp.module "EntryFieldsApp.List", (List, App, Backbone, Marionette, $, _) ->

 
  class List.Controller extends App.Controllers.Base


    list: (options) ->
      App.contentRegion.show @getLayout()
      @executeSettingsNavigation()
      @showEntryFields()
      


    executeSettingsNavigation:->
      App.execute "show:settings:navigation", 
        currentSetting: 'entry_fields' 
        region: @getLayout().settingsNavigationRegion
    


    showEntryFields: (options) ->
      fields = App.request "entry:fields:entities"
      App.execute "when:fetched", fields, =>
        searchCollection = fields.createSearchCollection()     
        
        @listenTo searchCollection, "add", (model, collection)=>
          toastr.success("Spurningu bætt við", model.get('title'))


        @showEntryFieldsView searchCollection
        @showSearchField(fields)



    getEntryFieldsView: (collection) ->
      new List.EntryFields 
        collection: collection



    showEntryFieldsView: (collection) ->
      view = @getEntryFieldsView(collection)
      @layout.listRegion.show view  

      @listenTo view, "create:field:clicked", (view)=>
        App.execute "create:entry:field", collection: view.collection

      @listenTo view, "childview:edit:clicked", (view)=>
        App.execute "edit:entry:field", model: view.model

      @listenTo view, "childview:destroy:clicked", (view)=>
        bootbox.confirm "Ertu viss um að þú viljir eyða þessari spurningu", (result) ->
          if result
            view.model.destroy()




    showSearchField:(collection) ->
      @layout.searchRegion.show @getSearchFieldView(collection)

    
    
    getSearchFieldView:(collection) ->
      search = new Backbone.Model({search: ""})
      search.on("change:search",(model, searchString)->
        collection.trigger("search:update",@.get("search"))
      )
      new List.Search model: search


    
    getLayout:=>
      @layout ?= new List.Layout
    