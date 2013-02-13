class App.Models.Person extends App.Models.Base

  urlRoot: "/people"
  paramRoot: '/people'

  initialize:->
    super
    spouseRelationship = @.get("spouse_relationships")
    console.log "spouseRelationship  ",spouseRelationship
    if spouseRelationship
      spouseRelationship.on("statusUpdate", @setAddres)
      @.on("change:form",@setButton)

    @


  setButton:(model,form)->
    console.log @, model
    @.off("change")
    new App.Views.AddRemoveButton({model:@,form:form}).render()


  setAddres:(model)=>
    if model.get('status') is true
      spouse_id = _.difference(_.filter(model.attributes,(v,k)-> k.search(/person|relation/) != -1), [@.get('id')])
      spouse = new App.Models.Person({id: spouse_id})
      spouse.url = "#{@.urlRoot}/#{spouse_id}"
      spouse.fetch(@setAdressCallbacks())
    else
     @.schema['address']= 
        type: 'NestedModel'
        model: 'App.Models.Base'
      console.log "Adding address :: ",
      address = new App.Models.Address()
      @.set('address', address)
      formEl = @.get("form").$el
      form = new Backbone.Form({model: address}).render()
      formEl.append(form.el)



  setAdressCallbacks:->
    thisPerson = @
    callbacks=
      success:(model, response) ->
        thisPerson.set('address_id', response.address_id)
        #console.log "Address id is set ",thisPerson
      error:(model, response) ->
        #console.warn "error", model



class App.Models.Subject extends App.Models.Person
  
  urlRoot: "/people"
  paramRoot: '/people'




class App.Collections.Person extends App.Collections.Base
  model: App.Models.Person





App.Models.Aliases.Relations = App.Models.Person
App.Models.Aliases.InverseRelations = App.Models.Person
App.Models.Aliases.Relation = App.Models.Person
App.Models.Aliases.InverseRelation = App.Models.Person
