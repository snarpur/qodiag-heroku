@Qapp.module "SubjectEntriesApp.Show", (Show, App, Backbone, Marionette, $, _) ->
  
  class Show.Layout extends App.Views.Layout
    template: "subject_entries_app/show/show_layout"

     

    regions: (options)->
      entryValueId = options.model.id
      regions=
        entryRegion: "#entry-region-#{entryValueId}"
        commentsRegion: "#comments-region-#{entryValueId}"
        newCommentRegion: "#new-comment-region-#{entryValueId}"




  class Show.Comment extends App.Views.ItemView
    template: "subject_entries_app/show/_comment"
    tagName: 'tr'


  class Show.Comments extends App.Views.CompositeView
    template: "subject_entries_app/show/comments"
    itemView: Show.Comment
    itemViewContainer: 'tbody'

    events:
      "click button": "newComment"

    ui:
      commentButton: 'button'

    initialize:->
      @on("form:close", @showButton)
    
    
    showButton:->
      @ui.commentButton.show()


    newComment:->
      @ui.commentButton.hide()
      @trigger "new:comment:clicked",@

  

  class Show.Entry extends App.Views.ItemView
    template: "subject_entries_app/show/_entry"
    tagName: "p"

   
  class Show.Entries extends App.Views.CollectionView
    itemView: Show.Entry


