require 'ostruct'
class People::ResponderItemsController < ApplicationController
  before_filter :create_responder_item, :only => [:new,:create]
  # authorize_resource
  respond_to :json

   def index
    @responder_items = ResponderItem.by_respondent(params[:person_id])
    # @responder_items = ResponderItem.by_subject(params[:person_id])
    @responder_items
    
    authorize!(:index, *(@responder_items.any? ? @responder_items : ResponderItem.new))
   end
end