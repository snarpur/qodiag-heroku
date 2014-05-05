@Qapp.module "SubjectEntriesApp.Show", (Show, App, Backbone, Marionette, $, _) ->
  
  class Show.Layout extends App.Views.Layout
    template: "subject_entries_app/show/show_layout"
    templateHelpers:=>
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
    className: 'comment'


  

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
    getTemplate: -> 
      template = if @options.field_type == 'multi-choice' then '_multi_choice_' else '_'
      "subject_entries_app/show/#{template}entry"
    
    tagName: "div"
    className: "entry"

    templateHelpers: =>
      index: =>
        @options.index
      field_type: =>
        @options.field_type
      value:=>
        value = if @options.field_type == "string" then @model.get('string_value') else @model.get('text_value')


  class Show.EmptyEntry extends App.Views.ItemView
    template: "subject_entries_app/show/_entryEmpty"
    tagName: "div"


   
  class Show.Entries extends App.Views.CollectionView
    itemView: Show.Entry
    emptyView: Show.EmptyEntry
    childViewOptions: ->
      options=
        field_type: @options.field_type


    
