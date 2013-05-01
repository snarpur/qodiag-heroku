@Qapp.module "EntrySetsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  List.Controller =
    
    listEntrySets: (options) ->
      
      @region = App.request("settings:content:region")
      App.request "entrySets:entities", (entrySets)=>
        entrySetsView = @getEntrySetsView(entrySets)
        @showEntrySets(entrySetsView)
        
    
    showEntrySets: (entrySetsView) ->
      @region.show entrySetsView
    

    getEntrySetsView: (entrySets) ->
      new List.EntrySets
        collection: entrySets
    