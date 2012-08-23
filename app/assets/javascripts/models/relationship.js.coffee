class App.Models.Relationship extends App.Models.Base


  initialize:()-> 
    @.schema = @.get('schema')
    @

class App.Models.InverseRelationship extends App.Models.Base


  initialize:()-> 
    @.schema = @.get('schema')
    @


App.Models.Aliases.Relationships = App.Models.Relationship
App.Models.Aliases.InverseRelationships = App.Models.InverseRelationship

class App.Collections.Relationships extends Backbone.Collection
class App.Collections.InverseRelationships extends Backbone.Collection