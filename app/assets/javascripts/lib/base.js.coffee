class App.Models.Base extends Backbone.Model

  initialize:=>
    console.log "initialize in BASE: " ,@.get('schema')
    @.schema = @.get('schema')?
    @

