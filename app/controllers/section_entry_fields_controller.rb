class SectionEntryFieldsController < ApplicationController
  respond_to :json

 
  def destroy
    @section_entry_field = SectionsEntryField.find(params[:id])
    @section_entry_field.destroy
    render 'sections/sections_entry_fields/destroy'
  end

end
