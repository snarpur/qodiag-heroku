class EntryValuesController < ApplicationController
  respond_to :json

  def index
    @entry_set_response_id = params[:entry_set_response_id]
    @entries = Section.find(params[:section_id]).entry_fields
  end

  def create
    @entry_value = EntryValue.create(params[:entry_value])
    render "show"
  end

  def show
    @entry_value = EntryValue.find(params[:id])
    KK.log @entry_value.inspect
  end

end