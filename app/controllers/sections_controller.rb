class SectionsController < ApplicationController
  respond_to :json


  def index
    @sections = EntrySet.find(params[:entry_set_id]).sections
  end


  def update
    @section = Section.find(params[:id])
    @section.update_attributes(params[:section])
    render "show"
  end


end

