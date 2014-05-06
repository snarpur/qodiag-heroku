@Qapp.module "SubjectNavigationApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  
  class List.Layout extends App.Views.Layout
    template: "subject_navigation_app/list/list_layout"
    regions:
      subjectDetailsRegion: "#subject-details-region"
      subjectNavigationRegion: "#subject-navigation-region"




  class List.SubjectDetails extends App.Views.ItemView
    template: "subject_navigation_app/list/subject_details"


  class List.Item extends App.Views.ItemView
    template: "subject_navigation_app/list/_item"
    tagName: 'li'

    className:->
      'active' if @model.isActive()
  
  
  class List.Navigation extends App.Views.CollectionView
    itemView: List.Item
    tagName: "ul"
    className: "reset subnav"




