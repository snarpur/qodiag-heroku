@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.FormPersonModel extends Entities.Person

    initialize:->
      @on "change",()=> 
        console.log "arguments::", arguments
        console.log "@::", @
        
      super

  _.extend Entities.FormPersonModel::,Entities.FormModel.prototype