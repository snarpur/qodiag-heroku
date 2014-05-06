class PeopleController < ApplicationController
  before_filter :get_user
  load_and_authorize_resource
  respond_to :json
  
  def show
    @person = PersonDecorator.decorate(Person.find(params[:id]))
    @responder_items = @person.responder_items.surveys

  end

  def history
    @person = Person.find(params[:subject_id])
  end

  def edit
    @person = PersonDecorator.decorate(Person.find(params[:id]))
  end

  def create
    @person = PersonDecorator.decorate(Person.create(params[:person]))    
  end

  def image_upload
    @person = Person.find(params[:id])
    @person.update_attributes(params[:person])
    redirect_to params[:redirect_path]
  end
  
  def update
    @person= Person.find(params[:id])

    if @person.update_attributes(params[:person])

      if !params[:subject_id].nil?
        id = params[:subject_id]
        params.except!(:subject_id)
      else
        id = params[:id]
      end
    end

    respond_with(@person)

  end
end
