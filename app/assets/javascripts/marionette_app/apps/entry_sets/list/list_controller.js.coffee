@Qapp.module "EntrySetsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Controller extends App.Controllers.Base

      
    listEntrySets: (options) ->      
      @region = App.request("settings:content:region")
      @entrySets = App.request "entry:sets:entities"
      App.execute "when:fetched", @entrySets, =>
        entrySetsView = @getEntrySetsView()
        @showEntrySets(entrySetsView)
        
    
    
    showEntrySets: (entrySetsView) ->
      @region.show entrySetsView

      @listenTo entrySetsView, "create:entry:set", =>
        
        newEntrySet = App.request "create:entry:set:entity"
       
        @listenTo newEntrySet,'created', => 
          App.navigate(@newEntrySetPath(newEntrySet),{trigger: true})

    

    getEntrySetsView: ->
      new List.EntrySets
        collection: @entrySets

    

    newEntrySetPath:(entrySet)->
      "settings#{Routes.entry_set_sections_path(entrySet.get('id'))}"
    