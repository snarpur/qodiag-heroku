@Qapp.module "EntryFieldsSectionApp.Show", (Show, App, Backbone, Marionette, $, _) ->
  
  Show.Controller =
    
    showFields: (options) ->
      callback = 
        callback: ->
          console.log "callback in shhow"
      opt = _.pick(options,'sectionId')
      console.log _.extend(opt,callback)
      App.request "sectionEntryFields:entities",_.extend(opt,callback)
      
