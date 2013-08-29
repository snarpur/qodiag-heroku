class SectionsController < ApplicationController
  respond_to :json


  def index
    @sections = EntrySet.find(params[:entry_set_id]).entry_sets_sections
  end

  def create
    @section = Section.create(params[:section])
    @section = @section.entry_sets_sections.first
    render "show"
  end

  def update
    @section = Section.find(params[:id])
    @section.update_attributes(params[:section])
    render "show"
  end
end