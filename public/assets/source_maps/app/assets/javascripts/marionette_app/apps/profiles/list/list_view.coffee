@Qapp.module "ProfilesApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Layout extends App.Views.Layout
    template: "profiles/list/templates/list_layout"
    regions:
      subjectProfileRegion: "#subject-profile-region"
      guardianProfileRegion: "#guardian-profile-region"


  class List.Subject extends App.Views.ItemView
    template: "profiles/list/templates/_subject"
    tagName: 'section'
    className: 'panel'

    triggers:
      'click .edit-item' : 'edit:subject:clicked'

  class List.AdultSubject extends App.Views.ItemView
    template: "profiles/list/templates/_adult_subject"

    triggers:
      'click .edit-item' : 'edit:subject:clicked'


  class List.Guardian extends App.Views.ItemView
    getTemplate: () ->

      if @model?.get('id')?
        "profiles/list/templates/_guardian"
      else
        "profiles/list/templates/_empty_guardian"
      
    tagName: "li"
    className: "list-group-item"
  
    triggers:
      'click .edit-item' : 'edit:guardian:clicked'
      'click .add-guardian' : 'create:guardian:clicked'
      
  
  class List.Guardians extends App.Views.CompositeView
    template: "profiles/list/templates/_guardians"
    itemView: List.Guardian
    itemViewContainer: 'ul.list-group'

  
  class List.Empty extends App.Views.ItemView
    template: "profiles/list/templates/_empty"


