class Sections::SectionsEntryFieldsController < ApplicationController
  respond_to :json

  def index
    @entry_fields = SectionsEntryField.where({:section_id => params[:section_id]}).includes(:entry_field)
  end


  def update
    @section = Section.find(params[:section_id])
    @section.update_attributes(params[:section])
    @entry_fields = @section.sections_entry_fields
    render "index"
  end


  def destroy
    @section_entry_field = SectionsEntryField.find(params[:id])
    @section_entry_field.destroy
  end

end

