class EntryFieldsController < ApplicationController
  respond_to :json

  def index
    @entry_fields = EntryField.all
  end

  def show
    @entry_field = EntryField.find(params[:id])
  end
  
  def create
    @entry_field = EntryField.new(params[:entry_field])
    if @entry_field.save
      render :show
    end
  end

  def update
    @entry_field = EntryField.find(params[:id])
    @entry_field.update_attributes(params[:entry_field])
    render :json => {:ok => 'ok'}
  end

  def destroy
    @entry_set = EntryField.find(params[:id])
    @entry_set.destroy
    render :json => {:ok => 'ok'}
  end

end

