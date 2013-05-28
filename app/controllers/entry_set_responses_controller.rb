class EntrySetResponsesController < ApplicationController
  respond_to :json

  def update
    @entry_set_response = EntrySetResponse.find(params[:id])
    if@entry_set_response.update_attributes(params[:entry_set_response])
      @entries = Section.find(params[:entry_set_response][:section_id]).entry_fields
      render "entry_values/index" 
    else
      respond_with @entry_set_response
    end    
  end
end
