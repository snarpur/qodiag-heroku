@Qapp.module "ModelMixins", (ModelMixins, App, Backbone, Marionette, $, _) ->

  ModelMixins.NestedValidation =
  
  _relationKeys:->
    nested = _.pluck @relations, "key"
    keys = _.keys @attributes
    _.intersection nested, keys
     

  _validatedRelations:->
    @_validationRegister ?= []
  
  
  _addToValidatedRelations:(key)->
    @_validatedRelations().push key


  _isValidWithNested:->
    !(@get("_errors")? || @get("_nestedErrors")?)
  

  _errorsWithNested:->
    errors = if @get("_errors")? then _.clone @get("_errors") else {}
    nestedErrors = if @get("_nestedErrors")? then _.clone @get("_nestedErrors") else {}
    _.extend errors, nestedErrors

  

  _setNestedErrors:(model,key,listener)->
    nestedErrors = @get("_nestedErrors") ? {}
    errors = {}
    
    if model instanceof Backbone.Collection 
      errors[key] = model.map (m) ->
        unless m._isValidWithNested()
          m._errorsWithNested()
    else
      unless model._isValidWithNested()
        errors[key] =  model._errorsWithNested()    
    
    unless _.isEmpty errors[key]
      nestedErrors = _.extend nestedErrors, errors
      @set("_nestedErrors", nestedErrors)

  

  validateNested: ->
    @set("_nestedErrors",null,{silent:true})
    relations = @_relationKeys()
    if _.isEmpty relations
      @isValid(true)
    else
      _.each relations, (m)=>
        
        nestedModel = @get(m)
        nestedConfig = _.findWhere(@relations, {key: m})
        validationListener = if nestedConfig.type == "Many" 
        then "validated:#{m}:collection"
        else "validated:#{m}.invalid validated:#{m}.valid"

        @once validationListener, (model,msg,options)=>     
          @_setNestedErrors(model,m,validationListener)
          @_addToValidatedRelations(m)
          if _.isEmpty _.difference(@_relationKeys(),@_validatedRelations())

            @isValid(true)
        
        nestedModel.validateNested()




  setNestedServerErrors:(errors)->
    nestedErrors = {}
    modelErrors = {}
    errors = _.omit errors, @_relationKeys()...
    _.each(errors, (v,k) =>
      keys = k.split(".")
      if keys.length == 1 
        modelErrors[k] = v
      else
        nestedErrors[keys[0]] ?= {}
        if keys.length == 2 then nestedErrors[keys[0]][keys[1]] =  v
        if keys.length >= 3 then nestedErrors[keys[0]][keys[1..-1].join(".")] = v
    )
    unless _.isEmpty modelErrors then @set("_errors",modelErrors)
    unless _.isEmpty nestedErrors then @set("_nestedErrors",nestedErrors)
    _.each nestedErrors,(v,k)=>
      @get(k).setNestedServerErrors(nestedErrors[k])