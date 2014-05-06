class EntryFieldsController < ApplicationController
  respond_to :json

  def index
    @entry_fields = EntryField.by_author_or_public(@current_user.person_id)
  end

  def show
    @entry_field = EntryField.find(params[:id])
  end
  
  def create
    # Code refactoring that use the relationship between person and Entry Fields
    @entry_field = @current_user.person.entry_fields.build(params[:entry_field])
    if @entry_field.save
      render :show
    else
      respond_with(@entry_field)
    end
  end

  def update
    @entry_field = EntryField.find(params[:id])
    @entry_field.update_attributes(params[:entry_field])
    KK.log @entry_field.inspect, :g
    respond_with(@entry_field) do |format|
      format.json { render :show }
    end

  end

  def destroy
    @entry_set = EntryField.find(params[:id])
    @entry_set.destroy
    render :json => {:ok => 'ok'}
  end

end

