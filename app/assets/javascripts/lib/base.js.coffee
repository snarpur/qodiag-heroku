class App.Models.Base extends Backbone.Model

  initialize:=>
    @.schema = @setSchema()
    @referenceEditorExtensions()
    @initializeNestedModels()
    @

  setSchema:=>
    if @.get('schema')?
      @.get('schema')
    else if !@.get('schema')? and @?.collection?.schema?
      $.extend(true,{},@.collection.schema)

  initializeNestedModels:=>
    model = @
    _.each(@getNestedModelNames(), (i)->
      nestedModel = model.getModelFromString(i.modelStr)
      schema = model.schema[i.name]
      schema.modelStr = i.modelStr
      schema.model = nestedModel
      nestedSchema = schema.schema
      nestedAttributes = model.get(i.name)
      unless nestedAttributes instanceof Backbone.Model or nestedAttributes instanceof Backbone.Collection
        if _.isArray(nestedAttributes)
          collection = new nestedModel(nestedAttributes,{schema:nestedSchema,registrationModel: model.get('registrationModel')})
          model.set(i.name, collection)
        else
          model.set(i.name, new nestedModel(_.extend(nestedAttributes,{schema:nestedSchema,registrationModel: model.get('registrationModel')}))) 
    )

  getModelFromString:(item)=>
    _.reduce(_.rest(item.split(".")),((mem,val) -> mem[val] ),App)

  getOrCreateNestedModel:(modelName)=>
    nestedModel = @.get(modelName)
    unless nestedModel instanceof Backbone.Model or nestedModel instanceof Backbone.Collection
      console.error "CREATING NEW MODEL::",@.schema[modelName].model ," #{modelName}  :with attributes: ",@.get(modelName)
      # new @.schema[modelName].model(@.get(modelName)) 
    else
      nestedModel
  
  getSchemaFields:=>
    _.keys(@.schema)
  
  getNonSchemaFields:=>
    _.difference(_.keys(@.attributes),@getSchemaFields())

  referenceEditorExtensions:=>
    _.each(@.schema,((v,k)->
      if v?.type? && _(v.type).startsWith("App")
        v.type = @getModelFromString(v.type) 
    ),@)

  getNestedModelNames:=>
    base = @
    _.chain(@.schema)
      .map((v,k) ->
        if v?.type == "NestedModel" || base.isNestedCollection(v?.type)
          associationType =  if base.isNestedCollection(v?.type)  then 'collection' else 'model'
          modelStr = if _.has(v,'modelStr') then v.modelStr else v[associationType]
          {name: k, modelStr: modelStr}
      )
      .compact()
      .flatten()
      .value()

  getNestedFields:=>
    _.chain(@.schema)
      .map(((v,k) ->
        if v?.type == "NestedModel" or  @isNestedCollection(v?.type)
          k 
      ),@)
      .compact().flatten().value()

  isNestedCollection:(type)=>
    (type? && _.isFunction(type) && !_.isEmpty(type.prototype.extensionType.match(/NestedCollection/)))

  bindToForm:(form)=>
    model = @
    _.each(form.fields,((v,k)->
      if v.schema.type == "NestedModel" || @isNestedCollection(v.schema.type)
        if _.isArray(v.editor.form)
          _.each(v.editor.form,(i)-> i.model.bindToForm(i))
        else
          v.editor.form.model.bindToForm(v.editor.form)
      else
        v.editor.model = @
        v.editor.on("change",(form,editor)->
          model.set(v.editor.key,v.editor.getValue())
        )
    ),@)
    @.set("form", form)

  jsonWithNestedSuffix:(json)=>
    nestedFields = @getNestedFields()
    _.each(nestedFields,((i)->

      nestedModel = @getOrCreateNestedModel(i)
      if nestedModel instanceof Backbone.Collection
        nestedJson = nestedModel.toJSON()
      else
        nestedJson = nestedModel.toJSON()
      unless _.isEmpty(nestedJson)
        json["#{i}_attributes"] = nestedJson
        delete json["#{i}"]
    ),@)
    json
  
  removeNonSchemaFields:(json)=>
    _.each(@getNonSchemaFields(),((i)->
      delete json["#{i}"]
    ),@)
    json
  
  toJSON:=>
    json = $.extend(true,{},@.attributes)
    json = @removeNonSchemaFields(json)
    @jsonWithNestedSuffix(json)

class App.Collections.Base extends Backbone.Collection

  initialize:(models,options)=>
    @.registrationModel = options.registrationModel if options?.registrationModel?
    @.schema = options.schema if options?.schema?
    @

      

