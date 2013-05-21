class People::EntrySetResponderItemsController < ApplicationController
  # load_and_authorize_resource
  respond_to :json

   def index
    @responses = ResponderItem.entry_set_responses.by_subject(params[:person_id]).includes(:entry_set_response)
   end
end