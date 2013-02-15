class PeopleController < ApplicationController
  before_filter :get_user
  load_and_authorize_resource

  def show
    @subject = Person.find(params[:id])
    @responder_items = @subject.responder_items.surveys
  end

  def history
    @subject = Person.find(params[:subject_id])
  end

  def information
    @subject = Person.find(params[:subject_id])
  end

  def upload
    @subject = Person.find(params[:subject_id])
  end

  def update
    @subject = Person.find(params[:id])
    @subject.update_attributes({:avatar => params[:avatar]})

    redirect_to :action => "show", :id => params[:id]
  end
end
