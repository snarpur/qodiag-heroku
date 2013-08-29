@Qapp.module "ProfilesApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Controller extends App.Controllers.Base

    showProfile:(subjectId)->
      App.execute "show:subject:navigation",{personId: subjectId, currentItemName: 'profiles'}
      @person = App.request "get:person:entity", subjectId
      
      App.execute "when:fetched", @person, =>
        
        @showSubject @person
        @showGuardian @person

      App.contentRegion.show @getLayout()


    showSubject: (person)->
      
      subjectView = @getSubjectView person
      @getLayout().subjectProfileRegion.show subjectView

      @listenTo subjectView, "edit:subject:clicked", (childSubjectView)=>
        App.execute "edit:guardian", model: childSubjectView.model, activeView: subjectView
    
    showGuardian: (person)->
      parents = person.getParents()

      App.execute "when:fetched", parents, =>

        #We should have always two parents, for that reason if we have only one, we will add the other one empty
        @addEmptyParent parents
        
        guardianView = @getGuardianView parents
        @getLayout().guardianProfileRegion.show guardianView

        @listenTo guardianView, "childview:edit:guardian:clicked", (childGuardianView)=>
          App.execute "edit:guardian", model: childGuardianView.model, activeView: guardianView

        @listenTo guardianView, "childview:create:guardian:clicked", (childGuardianView)=>
          App.execute "create:guardian", model: childGuardianView.model, activeView: guardianView, subjectId: @person.id


    addEmptyParent:(parents)->

      if parents.size() is 1 
        #TODO: We should change this way to do it       
        parents.add parents.first().clone().clear(), at: 1


    getSubjectView: (person)->
      new List.Subject
        model: person

    getGuardianView: (parents)->
      new List.Guardians
        collection: parents

    getLayout:=>
      @layout ?= new List.Layout