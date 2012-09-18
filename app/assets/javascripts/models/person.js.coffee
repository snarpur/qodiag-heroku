class App.Models.Person extends App.Models.Base

  urlRoot: "/people"
  paramRoot: '/people'



App.Models.Aliases.Relations = App.Models.Person
App.Models.Aliases.InverseRelations = App.Models.Person
App.Models.Aliases.Relation = App.Models.Person
App.Models.Aliases.InverseRelation = App.Models.Person


class App.Models.Subject extends App.Models.Person
  
  urlRoot: "/people"
  paramRoot: '/people'




class App.Collections.Person extends App.Collections.Base
  model: App.Models.Person

