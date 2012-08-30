class App.Models.Base extends Backbone.Model

  initialize:=>
    @.schema = @.get('schema')
    @initializeNestedModels()

  initializeNestedModels:=>
    model = @
    _.each(@getNestedModelNames(), (i)->
      nestedModel = model.getModelFromString(i.modelStr)
      
      # console.warn model,"---",i.name,"---",nestedModel
      # console.log "nestedAttrs --",model.get(i.name)
      
      schema = model.get("schema")[i.name]
      schema.model = nestedModel
      nestedSchema = schema.schema

      nestedAttributes = model.get(i.name)

      
      if nestedAttributes instanceof Backbone.Model
        console.log "already instance:", nestedAttributes
      else
        if _.isArray(nestedAttributes)
          # ==================== 
          # -- type: NestedModel
          # ====================
          collectionModel = model.getModelFromString(i.modelStr.replace(/Collections/,"Models"))
          collection = new nestedModel([],{model: collectionModel,schema: nestedSchema})
          modelObjects = _.map(nestedAttributes,(i)-> _.extend(i,{schema:nestedSchema}))
          collection.add(modelObjects)
          model.set("#{i.name}", collection)
          # >> END <<< type: NestedModel 
          # >> END <<< type: NestedModel

          
          # ==================== 
          # -- type: List
          # ====================
          # modelObjects  = _.map(model.get(i.name),(i)-> new nestedModel(_.extend(i,{schema:nestedSchema})))
          # model.set("#{i.name}", modelObjects) 
          # >> END <<< type: List 
          # >> END <<< type: List
        else
          model.set("#{i.name}", new nestedModel(_.extend(nestedAttributes,{schema:nestedSchema})))
    )
  
  schema:->
    console.log "trying to get schema", @
    if _.has(@,'value') && @.value instanceof Backbone.Model
      @.value.get("schema")
    else
      @.get("schema")

  getModelFromString:(item)=>
    _.reduce(_.rest(item.split(".")),((mem,val) -> mem[val] ),App)

  getCollectionFromString:(item)=>
    modelStr = _.titleize(_.camelize(item))
    collection = App.Collections.Aliases[modelStr] ? App.Collections[modelStr]
    collection ?= App.Collections.Base

  getOrCreateNestedModel:(modelName)=>
    nestedModel = @.get(modelName)
    unless nestedModel instanceof Backbone.Model or nestedModel instanceof Backbone.Collection
      console.error "CREATING NEW MODEL::",@.schema[modelName].model ,"   :with attributes: ",@.get(modelName)
      # new @.schema[modelName].model(@.get(modelName)) 
    else
      nestedModel
      

  getFields:=>
    model = @
    _.chain(@.get("schema"))
      .map((v,k)-> k unless model.isNestedModel(v) or v == 'Hidden')
      .compact()
      .value()
  
  getNestedModelNames:=>
    base = @
    _.chain(@.schema)
      .map((v,k) ->
        if v?.type == "NestedModel" || v.type == 'List'
          {name: k, modelStr: v.modelStr}
        else if _.isArray(v)
          _.map(v, (i)-> {name: k, modelStr: i.modelStr})
      )
      .compact()
      .flatten()
      .value()

  isNestedModel:(item)=>
    item?.type == "NestedModel" or _.isArray(item)
  
  bindToForm:(form)=>
    _.each(form.fields,((v,k)->
        if @.schema?[k]?.type == 'NestedModel'
         
          form_model = @.get(k) 
          console.log "----",form_model,"----",form
          if form_model instanceof Backbone.Collection

           console.info v.editor.form, form_model.models
           v.editor.form.model = form_model
           console.info v.editor.form.model instanceof Backbone.Collection
           _.each(form_model.models,(i)-> 
              i.bindToForm(v.editor.form)
            )
          else
            form_model.bindToForm(v.editor.form)            
        
      ),@)
  
  jsonWithNestedSuffix:(json)=>
    model = @
    nestedModelNames = @getNestedModelNames()
    _.each(nestedModelNames,(i)->
      nestedModel = model.getOrCreateNestedModel(i.name)
      nestedJson = nestedModel.toJSON()
      unless _.isEmpty(nestedJson)
        json["#{i.name}_attributes"] = nestedJson
        delete json["#{i.name}"]
    )
    json
  
  toJSON:=>
    json = $.extend(true,{},@.attributes)
    @jsonWithNestedSuffix(json)


class App.Collections.Base extends Backbone.Collection

  initialize:(models,options)=>
    @.schema = options?.schema?
    @
