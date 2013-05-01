@Qapp.module "EntrySetsApp.Show", (Show, App, Backbone, Marionette, $, _) ->
  
  Show.Controller =
    
    showEntrySet: (options) ->
      console.info "CONTROLLER ENTRSET =SHOW=",options
      # sections = App.request("settings:content:region")
      App.request "sections:entities", ({entrySetId: options.id},entrySets)=>
        # entrySetsView = @getEntrySetsView(entrySets)
        # @showEntrySets(entrySetsView)
        
    
    # showEntrySet: (entrySetsView) ->
    #   @region.show entrySetsView
    

    # getEntrySetsView: (entrySets) ->
    #   new Show.EntrySets
    #     collection: entrySets
    # 