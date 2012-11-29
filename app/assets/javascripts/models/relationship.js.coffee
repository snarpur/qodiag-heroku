class App.Models.Relationship extends App.Models.Base

  initialize:=>
    super
    @setSelectFieldTitle()
    @setStatus()
    @setFormModel()

  setSchema:=>
    if @.get('schema')?
      @.get('schema')
    else if !@.get('schema')? and @?.collection?.schema?
      if @.collection.schema[@.get('name')]
        $.extend(true,{},@.collection.schema[@.get('name')])
      else
        $.extend(true,{},@.collection.schema)

  setSelectFieldTitle:=>
    select = _.filter(@.schema,((v,k)->  v?.type?.search(/Select|Checkbox|Radio/) > -1))
    selectWithTitle = _.map(select,((i)-> i.title = @.get('name')),@)

  setStatus:()=>
    # if @.get("name") == 'parent'
    #   @.set('status',true)
    if @.isNew()
      @.set('status',false)
    else
      @.set('status',true)

  setFormModel:()=>
    if @.get("form")?
      @.get("form").model = @
      @bindToForm(@.get("form"))


class App.Collections.Relationships extends App.Collections.Base
  model: App.Models.Relationship
  url: '/relationships'

  initialize:(models,options)=>
    super
    @.on("change:status",@setRelationship)
    @.on("remove",@renewModel)
    @
  
  setRelationship:(model)=>
    if model.get('status') == false and not model.isNew()
      @.registrationModel.addToDestructionQueue(model)
    else
      @.registrationModel.removeFromDestructionQueue(model)

  renewModel:(model)=>
    attrs = _.without(model.getSchemaFields(),'id')
    attrs.push("form")
    modelAttrs = _.pick(model.attributes,attrs)
    @.add(modelAttrs)
  
  isPendingDestruction:(model)=>
    @.registrationModel.isPendingDestruction(model)
  
  toJSON:=>
    _.chain(@.models)
      .map(((i)->
        unless i.get('status') == false #|| @isPendingDestruction(i)
          i.toJSON()
      ),@)
      .compact()
      .value()




App.Models.Relationships = App.Models.Relationship
App.Models.Aliases.InverseRelationships = App.Models.Relationship
App.Collections.Aliases.InverseRelationships = App.Collections.Relationships
