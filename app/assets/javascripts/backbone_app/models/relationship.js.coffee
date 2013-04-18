class App.Models.Relationship extends App.Models.Base

  initialize:=>
    super
    @on("change:form",(model,form)-> model.trigger("change:status",model))

  
  setSelectFieldTitle:=>
    select = _.filter(@.schema,((v,k)->  v?.type?.search(/Select|Checkbox|Radio/) > -1))
    selectWithTitle = _.map(select,((i)-> i.title = @.get('name')),@)

  
  fieldTitle:(field)->
    super
    @i18nTitle("#{@.get('object_class')}.is_#{@.get('name')}")



class App.Collections.Relationships extends App.Collections.Base
  model: App.Models.Relationship
  url: '/relationships'

  initialize:(models,options)=>
    super
    @.on("change:status",@setRelationship)
    @.on("remove",@renewModel)

  
  setRelationship:(model)=>
    @.trigger('statusUpdate',model)
    if model.changed.status?
      if model.get('status') == false and not model.isNew()
        App.Event.trigger("addToDestructionQueue",model)
      else if model.get('status') == true
        App.Event.trigger("removeFromDestructionQueue",model)
   
  
  renewModel:(model)=>
    attrs = _.without(model.getSchemaFields(),'id')
    attrs.push("form","schema")
    modelAttrs = _.pick(model.attributes,attrs)
    @.add(modelAttrs)

  
  toJSON:=>
    _.chain(@.models)
      .map(((i)->
        unless i.get('status') == false
          i.toJSON()
      ),@)
      .compact()
      .value()


App.Models.Relationships = App.Models.Relationship
App.Models.Aliases.InverseRelationships = App.Models.Relationship
App.Collections.Aliases.InverseRelationships = App.Collections.Relationships
