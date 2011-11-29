class App.Models.ResponderItem extends Backbone.Model
  urlRoot: "/responder_items"
  paramRoot: '/responder_items'

  initialize:->
  
  deadlineIsPassed:=>
   deadline = Date.parse(@.get('deadline'))
   deadline.isBefore(Date.today())

  isCompleted:=>
    @.get('completed')?
  
  isOverdue:=>
    !@isPending() and !@isCompleted()
  
  isPending:=>
    !@isCompleted() and !@deadlineIsPassed() 

  status:=>
    if @isCompleted() then "completed"
    else if @isPending() then "pending"
    else if @isOverdue() then "overdue"

class App.Collections.ResponderItemsCollection extends Backbone.Collection
  model: App.Models.ResponderItem


