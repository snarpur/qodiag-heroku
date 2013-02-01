class App.Models.Relationship extends App.Models.Base

  initialize:=>
    super
    @setFormModel()
  
  setSelectFieldTitle:=>
    select = _.filter(@.schema,((v,k)->  v?.type?.search(/Select|Checkbox|Radio/) > -1))
    selectWithTitle = _.map(select,((i)-> i.title = @.get('name')),@)

  fieldTitle:(field)->
    super
    @i18nTitle("#{@.get('object_class')}.is_#{@.get('name')}")

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
    @.trigger('statusUpdate',model)
    if model.get('status') == false and not model.isNew()
      @formRenderModel.addToDestructionQueue(model)
    else
      @formRenderModel.removeFromDestructionQueue(model)

  renewModel:(model)=>
    attrs = _.without(model.getSchemaFields(),'id')
    attrs.push("form")
    modelAttrs = _.pick(model.attributes,attrs)
    @.add(modelAttrs)
  
  isPendingDestruction:(model)=>
    @.formRenderModel.isPendingDestruction(model)
  
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
