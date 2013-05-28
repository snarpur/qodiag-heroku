@Qapp.module "SubjectEntriesApp.Show", (Show, App, Backbone, Marionette, $, _) ->
  
  class Show.Layout extends App.Views.Layout
    template: "subject_entries_app/show/show_layout"
    templateHelpers:->
      helpers=
        regionId:()=>
          @options.regionId  


    regions: (options)->
      regionId = options.regionId
      regions=
        entryRegion: "#entry-region-#{regionId}"
        commentsRegion: "#comments-region-#{regionId}"
        newCommentRegion: "#new-comment-region-#{regionId}"




  class Show.Comment extends App.Views.ItemView
    template: "subject_entries_app/show/_comment"
    emptyView: Show.EmptyEntry
    tagName: 'li'


  class Show.Comments extends App.Views.CompositeView
    template: "subject_entries_app/show/comments"
    itemView: Show.Comment
    itemViewContainer: 'ul'

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

  class Show.EmptyEntry extends App.Views.ItemView
    template: "subject_entries_app/show/_entryEmpty"
    tagName: "p"


   
  class Show.Entries extends App.Views.CollectionView
    itemView: Show.Entry
    emptyView: Show.EmptyEntry
    # buildItemView:(item, ItemViewType, itemViewOptions) ->
    #   console.log arguments
    #   options = _.extend({model: item}, itemViewOptions)
    #   view = new ShowEntry(options)


    # emptyView: Show.EmptyEntry


