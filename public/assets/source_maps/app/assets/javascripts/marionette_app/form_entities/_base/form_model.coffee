@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Field extends Backbone.Model

    initialize:()->
      @setErrors()
      @addErrorListeners()
      @addValidateListeners()
      @setFieldValue()
      @addFieldValueListeners()
      
      super

    setErrors:()->
      @set("_errors",@get("formModel").get("_errors"))

    addErrorListeners: ()->
      @listenTo @get("formModel"),'change:_errors',(model,errors)=>
        @set("_errors",errors)

    addValidateListeners: ()->
      @listenToOnce @get("formModel"),"validated",()=>
        @on "change:fieldValue", ()=>
          @get("formModel").validate(@get("fieldName"))

    setFieldValue: ()->
      @set("fieldValue",@get("formModel").get(@get("fieldName")))

    addFieldValueListeners: ()->
      @on "change:fieldValue", ()=>
        @get("formModel").set(@get("fieldName"),@get("fieldValue"),{changed:@get("fieldName")})
      
      @listenTo @get("formModel"),"change:#{@get("fieldName")}",(model,options)=>
        @set("fieldValue", @get("formModel").get(@get("fieldName")))


  class Entities.Field.Separator extends Backbone.Model

  class Entities.Field.Title extends Backbone.Model

  class Entities.Field.Hidden extends Backbone.Model

  class Entities.Field.Date extends Entities.Field


  class Entities.Field.Select extends Entities.Field

    initialize:()->
      optionsFieldName = "_"+@get("fieldName")+"_options"
      @setOptions(optionsFieldName)
      @addOptionsListeners(optionsFieldName)
      super

    setOptions:(optionsFieldName)->
      if @get("formModel").get(optionsFieldName)?
        options = @get("formModel").get(optionsFieldName)
      else
        options = @get('options')

      unless options instanceof Backbone.Collection
        options = new Backbone.Collection(options)

      @set("options", options)

    addOptionsListeners: (optionsFieldName)->
      @listenTo @get("formModel"),"change:#{optionsFieldName}",(model,options)=>
        @set("options", @get("formModel").get(optionsFieldName))

    addFieldValueListeners: ()->
      @on "change:fieldValue", (model,selected,options)=>
        modelSelected = @get("options").findWhere {id:(Number)(selected)}
        @get("formModel").set(@get("fieldName"),@get("fieldValue"),{modelSelected:modelSelected})
      
      @listenTo @get("formModel"),"change:#{@get("fieldName")}",(model,options)=>
        @set("fieldValue", @get("formModel").get(@get("fieldName")))


  class Entities.Field.Text extends Entities.Field

  class Entities.Field.TextArea extends Entities.Field

  class Entities.Field.CheckBox extends Entities.Field
    initialize:()->
      optionsFieldName = "_"+@get("fieldName")+"_options"
      @setOptions(optionsFieldName)
      @addOptionsListeners(optionsFieldName)
      super

    setOptions:(optionsFieldName)->
      if @get("formModel").get(optionsFieldName)?
        options = @get("formModel").get(optionsFieldName)
      else if @get("options")?
        options = @get('options')
      else
        options = @get('formModel')

      unless options instanceof Backbone.Collection
        options = new Backbone.Collection(options)


      @set("options",options)

    addOptionsListeners: (optionsFieldName)->
      @listenTo @get("formModel"),"change:#{optionsFieldName}",(model,options)=>
        @set("options", @get("formModel").get(optionsFieldName))


  class Entities.Field.Radio extends Entities.Field.Select

  class Entities.Field.Controller extends Backbone.Model

  class Entities.FieldCollection extends Backbone.Collection
    model:(attrs, options)->
      if attrs.fieldType?
        fieldType = "#{_.camelize _.capitalize attrs.fieldType}"
        new Entities.Field[fieldType](attrs, options)


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
