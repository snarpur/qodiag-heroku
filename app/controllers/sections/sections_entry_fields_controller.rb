class Sections::SectionsEntryFieldsController < ApplicationController
  respond_to :json

  def index
    @entry_fields = SectionsEntryField.where({:section_id => params[:section_id]}).includes(:entry_field)
  end


  def destroy
    @section_entry_field = SectionsEntryField.find(params[:id])
    @section_entry_field.destroy
  end
end

