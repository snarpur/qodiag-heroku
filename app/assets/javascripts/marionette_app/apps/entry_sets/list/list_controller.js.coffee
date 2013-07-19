@Qapp.module "EntrySetsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Controller extends App.Controllers.Base

      
    listEntrySets: (options) ->      
      App.contentRegion.show @getLayout()
      @entrySets = App.request "entry:sets:entities"
      
      App.execute "when:fetched", @entrySets, =>
         
        entrySetsView = @getEntrySetsView()
        @showEntrySets(entrySetsView)
        @executeSettingsNavigation()
        
    
    
    showEntrySets: (entrySetsView) ->
      @getLayout().listRegion.show entrySetsView
      
      @listenTo entrySetsView, "new:entry:set", =>
        App.execute "create:entry:set", {activeView: entrySetsView}
      
      @listenTo entrySetsView,'entry:set:created', (newEntrySet) => 
        App.navigate(@newEntrySetPath(newEntrySet),{trigger: true})
    

    getEntrySetsView: ->
      view = new List.EntrySets
        collection: @entrySets

      @listenTo view, "childview:delete:entry:set", (view)=> @confirmDelete(view)
      view
    
    

    executeSettingsNavigation:->
      App.execute "show:settings:navigation", 
        currentSetting: 'entry_sets' 
        region: @getLayout().settingsNavigationRegion
    

    
    confirmDelete:(view)->
      bootbox.confirm "Ertu viss um að þú viljir eyða eyðublaði #{view.model.get('name')}", (result) ->
        if result
          view.model.destroy()

    

    getLayout:=>
      @layout ?= new List.Layout

    

    newEntrySetPath:(entrySet)->
      "settings#{Routes.entry_set_sections_path(entrySet.get('id'))}"
    