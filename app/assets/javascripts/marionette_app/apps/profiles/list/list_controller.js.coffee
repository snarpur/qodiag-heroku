@Qapp.module "ProfilesApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Controller extends App.Controllers.Base

    showProfile:(subjectId)->
      @person = App.request "get:person:entity", subjectId 
      App.execute "when:fetched", @person, =>
        @profile = new App.Entities.FormPersonModel(@person.attributes)
        App.execute "show:subject:navigation",{person: @profile, personId: subjectId, currentItemName: 'profiles'} 
        if @profile.get("age") >= 18   
          @showAdultSubject @profile
        else
          @showSubject @profile
          @showGuardians @profile unless @profile.get("age") >= 18

      App.contentRegion.show @getLayout()

    showSubject: (person)->
      
      subjectView = @getSubjectView person
      
      @getLayout().subjectProfileRegion.show subjectView

      @listenTo subjectView, "edit:subject:clicked", (childSubjectView)=>
        App.execute "edit:guardian", model: childSubjectView.model, activeView: subjectView

    showAdultSubject: (person)->

      subjectView = @getAdultSubjectView person
      @getLayout().subjectProfileRegion.show subjectView

      @listenTo subjectView, "edit:guardian:clicked", (childSubjectView)=>
        App.execute "edit:guardian", model: childSubjectView.model, activeView: subjectView

    showGuardian: (person)->
      
      subjectView = @getSubjectView person
      @getLayout().subjectProfileRegion.show subjectView

      @listenTo subjectView, "edit:subject:clicked", (childSubjectView)=>
        App.execute "edit:guardian", model: childSubjectView.model, activeView: subjectView
    
    showGuardians: (person)->
      parents = person.getParents()

      App.execute "when:fetched", parents, =>
        #We should have always two parents, for that reason if we have only one, we will add the other one empty
        @addEmptyParent parents

        parents = new App.Entities.FormPeopleCollection(parents.toJSON(acceptsNested: false))
        
        guardianView = @getGuardiansView parents
        @getLayout().guardianProfileRegion.show guardianView

        @listenTo guardianView, "childview:edit:guardian:clicked", (childGuardianView)=>
          App.execute "edit:guardian", model: childGuardianView.model, activeView: guardianView

        @listenTo guardianView, "childview:create:guardian:clicked", (childGuardianView)=>
          App.execute "create:guardian", model: childGuardianView.model, activeView: guardianView, subjectId: @profile.id


    addEmptyParent:(parents)->
      if parents.size() is 0
        parent = new App.Entities.FormPersonModel()
        parent.set(address: {})
        parents.add parent, at: 0

      if parents.size() is 1      
        parent = parents.first().clone().clear()
        parent.set(address: {})
        parents.add parent, at: 1

    getSubjectView: (person)->
      new List.Subject
        model: person
        name: "Subject"

    getAdultSubjectView: (person)->
      new List.AdultSubject
        model: person
        name: "Subject"

    getGuardiansView: (parents)->
      new List.Guardians
        collection: parents
        name: "Guardian"

    getGuardianView: (person)->
      new List.Guardian
        model: person
        name: "Guardian"

    getLayout:=>
      @layout ?= new List.Layout