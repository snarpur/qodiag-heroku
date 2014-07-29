class App.Models.Subject extends App.Models.Person
  paramRoot: "subject"

  initialize:->
    super
    @urlRoot = @getUrlRoot()

  getUrlRoot:=>
    ()->
      unless @collection?
        urlRoot = App.Collections.Subject.prototype.url
        urlRoot.replace(/\:id/,@get("caretaker_id"))
      else
        @collection.url()


class App.Collections.Subject extends App.Collections.Person
  model: App.Models.Subject
  url: "/caretaker/:id/subjects"
  initialize:(models, options)->
    @caretakerId = options.caretaker_id
    @url = ()-> 
      @url.replace(/\:id/,@caretakerId)

    
