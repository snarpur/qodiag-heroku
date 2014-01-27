class EntrySetResponsesController < ApplicationController
  respond_to :json

  def show
    @entry_set_response = EntrySetResponse.find(params[:id])
  end
  
  def update
    @entry_set_response = EntrySetResponse.find(params[:id])
    @entry_set_response.update_attributes(params[:entry_set_response])
    #   # render :json => {:ok =>'ok'}
    #   render :update
    #   respond_with @entry_set_response
    # else
    respond_with @entry_set_response
    # end    
  end
end
