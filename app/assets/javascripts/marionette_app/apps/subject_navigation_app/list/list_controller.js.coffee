@Qapp.module "SubjectNavigationApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Controller extends App.Controllers.Base


    list:(options)->
      items = App.request "get:subject:navigation", options
      @showLayout()
      @showNavigation(items)  
      @setCurrentSubject(options.person)
      @showSubjectDetails(options.person)
      

    getNavigationView:(items)->
      new List.Navigation collection: items

    

    showNavigation:(items)->
      view = @getNavigationView(items)
      @getLayout().subjectNavigationRegion.show view



    getSubjectView:(subject) ->
      new List.SubjectDetails model: subject



    showSubjectDetails:(subject) ->
      view = @getSubjectView(subject) 
      @getLayout().subjectDetailsRegion.show view
    


    showLayout:->
      @getHeaderRegion().show @getLayout()

    

    getLayout:->
      @layout ?= new List.Layout

    

    getHeaderRegion:->
      App.request "content:header:region"



    setCurrentSubject:(subject)->
      App.reqres.setHandler "get:current:subject", -> subject 
