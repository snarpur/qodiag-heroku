@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Field extends Backbone.Model

    initialize:()->
      #Set the value taht comes from the Form Model into the field value
      @.set("fieldValue",@.get("formModel").get(@.get("fieldName"))) if @.get("formModel")?.get(@.get("fieldName"))?
      
      @on "change:fieldValue", ()->
        @.get("formModel").set(@.get("fieldName"),@.get("fieldValue"))

  class Entities.FieldCollection extends Backbone.Collection
    model: Entities.Field

    initialize:(models,options)->
      {@rootModel} = options
      @buildCollection(models)

    buildCollection:(models)->
      _.each models, (model) =>
        if model.formModel?
          model.formModel = @rootModel.get(model.formModel)
        else
          model.formModel = @rootModel
      models

      

  class Entities.FormModel


 

  

  
  