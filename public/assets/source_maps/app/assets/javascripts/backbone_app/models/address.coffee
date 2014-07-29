class App.Models.Address extends App.Models.Base
  urlRoot: "/address"
  paramRoot: "address"

  initialize:()=>
    super
    @.once("change:form",()-> 
     if @get("submitDisabled") is true then @disableFields()
    )
    @.url = ()->
      if @get('person_id')
        "/people/#{@get('person_id')}#{@.urlRoot}"
      else
        "#{@.urlRoot}"                           
