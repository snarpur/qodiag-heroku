class App.Models.Person extends Backbone.Model
  
  urlRoot: "/people"
  paramRoot: '/people'

  initialize:()->

class App.Models.Subject extends App.Models.Person
  
  urlRoot: "/people"
  paramRoot: '/people'




class App.Collections.PersonCollection extends Backbone.Collection
  model: App.Models.Person

