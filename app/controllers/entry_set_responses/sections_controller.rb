class EntrySetResponses::SectionsController < ApplicationController
  respond_to :json


  def index
    @entry_set_response_id = params[:entry_set_response_id]
    @entries = Section.find(params[:section_id]).entry_fields
  end
end

