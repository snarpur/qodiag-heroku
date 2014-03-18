@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Field extends Backbone.Model

    initialize:()->
      
      if @get("fieldType") isnt "separator"

        if @get("fieldType") in ["select","radio"] and not @get("options")?
          @selectOrRadioFileTypeInit()

        @defaultFileTypeInit()
        
      super

    selectOrRadioFileTypeInit:()->
      options = "_"+@get("fieldName")+"_options"
      @set("options", @get("formModel").get(options))

    defaultFileTypeInit:()->
      @set("fieldValue",@get("formModel").get(@get("fieldName")))
      
      @on "change:fieldValue", ()=>
        console.log "changing the model::",arguments
        @get("formModel").set(@get("fieldName"),@get("fieldValue"),{changed:@get("fieldName")})

      @get("formModel").on "change:_errors", (model,errors)=>
        @set("_errors",errors)
      
  class Entities.FieldCollection extends Backbone.Collection
    model:Entities.Field

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
          model.formModel = @rootModel unless model.fieldType is "separator"

      models

      
  class Entities.FormModel

        


 

  

  
  