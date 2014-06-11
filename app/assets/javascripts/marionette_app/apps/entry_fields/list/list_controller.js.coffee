@Qapp.module "EntryFieldsApp.List", (List, App, Backbone, Marionette, $, _) ->

 
  class List.Controller extends App.Controllers.Base


    list: (options) ->
      App.contentHeaderRegion.show @getHeader()
      App.contentRegion.show @getLayout()
      @showEntryFields()
 

    showEntryFields: (options = {}) ->
      fields = App.request "entry:fields:entities"
      # NOTE: try to delete the when:fetch - to avoid the tiem it takes to show he spinner
      App.execute "when:fetched", fields, =>
        searchCollection = fields.createSearchCollection()
      # searchCollection = fields     

        @showEntryFieldsView searchCollection, fields


    getEntryFieldsView: (collection) ->
      new List.EntryFields 
        collection: collection



    showEntryFieldsView: (collection, fields) ->
      view = @getEntryFieldsView(collection)

      

      @getLayout().listRegion.on "show", () =>
        @showSearchField(fields)
        
      @listenTo collection, "updated", (model, collection)=>   
        toastr.success(I18n.t("entry_set.messages.question_edited"),model.get('title'))

      

      @listenTo view, "create:field:clicked", (view)=>
        App.execute "create:entry:field", collection: view.collection

      @listenTo view, "childview:edit:clicked", (view)=>
        App.execute "edit:entry:field", model: view.model

      @listenTo view, "childview:destroy:clicked", (view)=>
        bootbox.confirm I18n.t("entry_set.messages.confirm_delte_question"), (result) ->
          if result
            view.model.destroy()

      @show view,
        region: @getLayout().listRegion
        loading: true 

    resetSearchField:->
      @layout.$el.find(".search-input").val("")


    showSearchField:(collection) ->
      @show @getSearchFieldView(collection),
         region: @layout.searchRegion
         loading:false 
    
    
    getSearchFieldView:(collection) ->
      @search = new Backbone.Model({search: ""})
      @search.on("change:search",(model, searchString)->
        collection.trigger("search:update",@.get("search"))
      )
      new List.Search model: @search

    getHeader:=>
      new List.Header
        model: new Backbone.Model()
    
    getLayout:=>
      @layout ?= new List.Layout
    