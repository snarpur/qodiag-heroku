class EntrySetResponses::SectionsController < ApplicationController
  respond_to :json


  def index
    @entry_set_response = EntrySetResponse.find(params[:entry_set_response_id])
    @entries = Section.find(params[:section_id]).sections_entry_fields
  end

end

