@Qapp.module "SubjectNavigationApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  
  class List.Item extends App.Views.ItemView
    template: "subject_navigation_app/list/_item"
    tagName: 'li'
  

  class List.Navigation extends App.Views.CollectionView
    itemView: List.Item
    tagName: "ul"
    className: "nav nav-pills"

