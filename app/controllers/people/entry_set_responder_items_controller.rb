class People::EntrySetResponderItemsController < ApplicationController
  # load_and_authorize_resource
  respond_to :json

   def index
    person_ids = params[:person_id].split(',')
    @responses = ResponderItem.entry_set_responses.by_subject(person_ids).order_by_complete_date.includes(:entry_set_response)
   end
end