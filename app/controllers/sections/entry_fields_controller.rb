class Sections::EntryFieldsController < ApplicationController
  respond_to :json

  def index
    @entry_fields = SectionsEntryField.where({:section_id => params[:section_id]}).includes(:entry_field)
  end

end

