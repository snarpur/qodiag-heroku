@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Field extends Backbone.Model

    initialize:()->
      
      if @get("fieldType") isnt "separator"

        if @get("fieldType") in ["select","radio","checkbox"] and not @get("options")?
          @selectOrRadioFileTypeInit()

        @defaultFileTypeInit()
        
      super

    selectOrRadioFileTypeInit:()->
      optionsFieldName = "_"+@get("fieldName")+"_options"
      @set("options", @get("formModel").get(optionsFieldName))

      @listenTo @get("formModel"),"change:#{optionsFieldName}",(model,options)=>
        @set("options", @get("formModel").get(optionsFieldName))


    defaultFileTypeInit:()->
      @set("fieldValue",@get("formModel").get(@get("fieldName")))
      @set("_errors",@get("formModel").get("_errors"))
      
      @listenTo @get("formModel"),'change:_errors',(model,errors)=>
        @set("_errors",errors)

      @listenToOnce @get("formModel"),"validated",()=>
        @on "change:fieldValue", ()=>
          @get("formModel").validate(@get("fieldName"))

      @on "change:fieldValue", ()=>
        @get("formModel").set(@get("fieldName"),@get("fieldValue"),{changed:@get("fieldName")})
      
      @listenTo @get("formModel"),"change:#{@get("fieldName")}",(model,options)=>
        @set("fieldValue", @get("formModel").get(@get("fieldName")))

  class Entities.FieldCollection extends Backbone.Collection
    model:Entities.Field

    initialize:(models,options)->
      {@rootModel,@controllerModel} = options
      _.each models, (model) =>
        if model.modelName?
          if model.modelName is "controller"
            model.formModel = @controllerModel
          else         
            if _.isString model.modelName
              nestedModels = model.modelName.split(".")  

              auxModel = @rootModel
              _.each nestedModels, (nested) =>
                formModel =  auxModel.get(nested)
                auxModel = formModel

              
              model.formModel = auxModel

        else      
          model.formModel = @rootModel
  
        if model.validations?
          _.each model.validations, (validation) =>
            model.formModel.validation["#{model.fieldName}"] = validation

  class Entities.FormModel

        


 

  

  
  