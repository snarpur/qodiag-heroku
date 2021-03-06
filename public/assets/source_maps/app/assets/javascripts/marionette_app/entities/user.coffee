@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
	
	class Entities.User extends Entities.Model

	
		subjectIds:->
			_.map @get('subjects'), (i)-> i.id

	
	class Entities.UsersCollection extends Entities.Collection
		model: Entities.User
		url: -> Routes.users_path()
	
	API =
		setCurrentUser: (currentUser) ->
			new Entities.User currentUser


		getUserEntities: (cb) ->
			users = new Entities.UsersCollection
			users.fetch
				reset: true
				success: ->
					cb users
	
	App.reqres.setHandler "set:current:user", (currentUser) ->
		API.setCurrentUser currentUser
	
	App.reqres.setHandler "user:entities", (cb) ->
		API.getUserEntities cb
