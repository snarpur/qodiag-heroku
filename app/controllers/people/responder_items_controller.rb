require 'ostruct'
class People::ResponderItemsController < ApplicationController
  before_filter :create_responder_item, :only => [:new,:create]
  # authorize_resource
  respond_to :json

   def index
    by_concern = params.key?("concern") ? "by_#{params['concern']}" : "by_subject"
    @responder_items = ResponderItem.send by_concern, params[:person_id]
   
    @responder_items
    
    authorize!(:index, *(@responder_items.any? ? @responder_items : ResponderItem.new))
   end
end