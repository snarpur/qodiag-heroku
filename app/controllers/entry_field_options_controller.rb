class EntryFieldOptionsController < ApplicationController
  respond_to :json

  def index
    @options = EntryField.find(params[:entry_field_id]).entry_field_options
  end

  def destroy
    @option = EntryFieldOption.find(params[:id])
    @option.destroy
    render :json => {:ok => 'ok'}
  end

end