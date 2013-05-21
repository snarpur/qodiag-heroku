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
    

    getEntrySetsView: ->
      new List.EntrySets
        collection: @entrySets
    