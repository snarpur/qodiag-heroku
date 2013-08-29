@Qapp.module "ProfilesApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Layout extends App.Views.Layout
    template: "profiles/list/templates/list_layout"

    regions:
      subjectProfileRegion: "#subject-profile-region"
      guardianProfileRegion: "#guardian-profile-region"


  class List.Subject extends App.Views.ItemView
    template: "profiles/list/templates/_subject"

    triggers:
      'click .edit-item' : 'edit:subject:clicked'


  class List.Guardian extends App.Views.ItemView
    template: "profiles/list/templates/_guardian"
    tagName: "div"
    className: "span5"

    triggers:
      'click .edit-item' : 'edit:guardian:clicked'


  class List.EmptyGuardian extends App.Views.ItemView
    template: "profiles/list/templates/_empty_guardian"
    tagName: "div"
    className: "span5"

    triggers:
      'click .add-guardian' : 'create:guardian:clicked'

  class List.Guardians extends App.Views.CompositeView
    template: "profiles/list/templates/_guardians"
    getItemView:(model)->
      if model?.id 
        List.Guardian
      else
        List.EmptyGuardian

    itemViewContainer: "div#foreldrar"

  
  class List.Empty extends App.Views.ItemView
    template: "profiles/list/templates/_empty"


