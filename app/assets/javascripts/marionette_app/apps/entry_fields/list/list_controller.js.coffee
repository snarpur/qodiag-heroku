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
    


    showEntryFields: (options = {}) ->
      fields = App.request "entry:fields:entities"
      # NOTE: try to delete the when:fetch - to avoid the tiem it takes to show he spinner
      App.execute "when:fetched", fields, =>
        searchCollection = fields.createSearchCollection()     

        @showEntryFieldsView searchCollection, fields


    getEntryFieldsView: (collection) ->
      new List.EntryFields 
        collection: collection



    showEntryFieldsView: (collection, fields) ->
      view = @getEntryFieldsView(collection)

      @getLayout().listRegion.on "show", () =>
        @showSearchField(fields)
        
      @listenTo collection, "updated", (model, collection)=>
        toastr.success("Spurningu breytt við", model.get('title'))   
      
      #DELETE: When we are totally sure that the loading views works
      #@layout.listRegion.show view  
      @show view,
         region: @getLayout().listRegion
         loading:true 

      @listenTo view, "create:field:clicked", (view)=>
        App.execute "create:entry:field", collection: view.collection

      @listenTo view, "childview:edit:clicked", (view)=>
        App.execute "edit:entry:field", model: view.model

      @listenTo view, "childview:destroy:clicked", (view)=>
        bootbox.confirm "Ertu viss um að þú viljir eyða þessari spurningu", (result) ->
          if result
            view.model.destroy()


    resetSearchField:->
      @layout.$el.find(".search-input").val("")


    showSearchField:(collection) ->
      #DELETE: When we are totally sure that the loading views works
      #@layout.searchRegion.show @getSearchFieldView(collection)

      @show @getSearchFieldView(collection),
         region: @layout.searchRegion
         loading:false 
    
    
    getSearchFieldView:(collection) ->
      @search = new Backbone.Model({search: ""})
      @search.on("change:search",(model, searchString)->
        collection.trigger("search:update",@.get("search"))
      )
      new List.Search model: @search


    
    getLayout:=>
      @layout ?= new List.Layout
    