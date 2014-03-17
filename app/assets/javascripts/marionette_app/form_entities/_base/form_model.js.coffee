@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Field extends Backbone.Model

    initialize:()->
      #Set the value taht comes from the Form Model into the field value
      @.set("fieldValue",@.get("formModel").get(@.get("fieldName"))) if @.get("formModel")?.get(@.get("fieldName"))?
      
      @on "change:fieldValue", ()->
        @.get("formModel").set(@.get("fieldName"),@.get("fieldValue"),{changed:@.get("fieldName")})

      @.get("formModel").on "change:_errors", (model,errors)=>
        @.set("_errors",errors)


  class Entities.FieldCollection extends Backbone.Collection
    model: Entities.Field

    initialize:(models,options)->
      {@rootModel} = options
      @buildCollection(models)

    buildCollection:(models)->
      _.each models, (model) =>
        if model.formModel?
          nestedModels = model.formModel.split(".")          
          auxModel = @rootModel
          _.each nestedModels, (nested) =>
            formModel =  auxModel.get(nested)
            auxModel = formModel
          model.formModel = auxModel
        else
          model.formModel = @rootModel

      models

      

  class Entities.FormModel

    # initialize:->

    #   @on "change",()=> 
    #     console.log "arguments::", arguments
    #     console.log "@::", @
        


 

  

  
  