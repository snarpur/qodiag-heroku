@Qapp.module "EntryFieldsApp.List", (List, App, Backbone, Marionette, $, _) ->

 
  class List.Controller extends App.Controllers.Base


    list: (options) ->
      @executeSettingsNavigation()
      App.contentRegion.show @getLayout()
      @executeSettingsNavigation()
      @showEntryFields()
 

    showEntryFields: (options = {}) ->
      fields = App.request "entry:fields:entities"
      # NOTE: try to delete the when:fetch - to avoid the tiem it takes to show he spinner
      App.execute "when:fetched", fields, =>
        searchCollection = fields     
        @showEntryFieldsView fields


    getEntryFieldsView: (collection) ->
      new List.EntryFields 
        collection: collection

    executeSettingsNavigation:() ->
      App.execute "show:settings:navigation", 
        iconClass: "fa fa-question"
        i18n: "terms.question"

    showEntryFieldsView: (fields) ->
      view = @getEntryFieldsView(fields)

      @listenTo fields, "updated", (model, collection)=>   
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

    getLayout:=>
      @layout ?= new List.Layout
    