@Qapp.module "EntrySetsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  List.Controller =
    
    listEntrySets: (options) ->
      App.request "entrySets:entities", (entrySets)=>
        @region = options.region
        entrySetsView = @getEntrySetsView(entrySets)
        @showEntrySets(entrySetsView)
        
    
    showEntrySets: (entrySetsView) ->
      @region.show entrySetsView
    

    getEntrySetsView: (entrySets) ->
      new List.EntrySets
        collection: entrySets
    