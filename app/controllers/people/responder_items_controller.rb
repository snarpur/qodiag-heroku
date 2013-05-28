require 'ostruct'
class People::ResponderItemsController < ApplicationController
  before_filter :create_responder_item, :only => [:new,:create]
  load_and_authorize_resource
  respond_to :json

   def index
    @responder_items = ResponderItem.by_respondent(params[:person_id]).uncompleted
   end
end