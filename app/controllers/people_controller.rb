class PeopleController < ApplicationController
  before_filter :get_user
  load_and_authorize_resource

  
  def show
    @person = Person.find(params[:id])
    @responder_items = @person.responder_items.surveys
  end

  def history
    @person = Person.find(params[:subject_id])
  end

  def information
    @person = Person.find(params[:subject_id])
  end

  def upload
    @person = Person.find(params[:subject_id])
  end

  def update
    @person= Person.find(params[:id])
    @person.update_attributes(params[:person])
    redirect_to :action => "show", :id => params[:id]
  end
end
