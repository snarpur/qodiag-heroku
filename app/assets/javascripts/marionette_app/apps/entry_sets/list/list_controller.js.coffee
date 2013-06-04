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

      @listenTo entrySetsView, "create:entry:set", =>
        newEntrySet = App.request "create:entry:set:entity"
       
        @listenTo newEntrySet,'created', => 
          App.navigate(@newEntrySetPath(newEntrySet),{trigger: true})
    

    getEntrySetsView: ->
      new List.EntrySets
        collection: @entrySets


    
    executeSettingsNavigation:->
      App.execute "show:settings:navigation", 
        currentSetting: 'entry_sets' 
        region: @getLayout().settingsNavigationRegion
    


    getLayout:=>
      @layout ?= new List.Layout

    newEntrySetPath:(entrySet)->
      "settings#{Routes.entry_set_sections_path(entrySet.get('id'))}"
    