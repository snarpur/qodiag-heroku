@Qapp.module "EntrySetsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Controller extends App.Controllers.Base

      
    listEntrySets: (options) ->    
      @executeSettingsNavigation()
      App.contentRegion.show @getLayout()
      @entrySets = App.request "entry:sets:entities" 
      entrySetsView = @getEntrySetsView()
      @showEntrySets(entrySetsView)

        
    showEntrySets: (entrySetsView) ->
      
      @show entrySetsView,
         region: @getLayout().listRegion
         loading: true 
      
      @listenTo entrySetsView, "new:entry:set", =>
        App.execute "create:entry:set", {activeView: entrySetsView}
      
      @listenTo entrySetsView,'entry:set:created', (newEntrySet) => 
        App.navigate(@newEntrySetPath(newEntrySet),{trigger: true})
    

    getEntrySetsView: ->
      view = new List.EntrySets
        collection: @entrySets

      @listenTo view, "childview:delete:entry:set", (view)=> @confirmDelete(view)
      view
    

    executeSettingsNavigation:() ->
      App.execute "show:settings:navigation", 
        iconClass: "fa fa-list-ul"
        i18n: "entry_set.model_name_plural"

    deleteFromEntrySetSections: (options) ->    
      bootbox.confirm I18n.t("activerecord.confirm.messages.deleted", model: options.model.get('name')), (result) ->
        if result
          options.model.destroy()
          window.location.href = "/#settings/entry_sets"

    
    confirmDelete:(view)->
      bootbox.confirm I18n.t("activerecord.confirm.messages.deleted", model: view.model.get('name')), (result) ->
        if result
          view.model.destroy()

    getLayout:=>
      @layout ?= new List.Layout

    newEntrySetPath:(entrySet)->
      "settings#{Routes.entry_set_sections_path(entrySet.get('id'))}"
    
