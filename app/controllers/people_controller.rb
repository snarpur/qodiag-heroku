class PeopleController < ApplicationController
  before_filter :get_user
  load_and_authorize_resource
  respond_to :json
  
  def show
    @person = Person.find(params[:id])
    @responder_items = @person.responder_items.surveys
    # @user = User.find params[:id]
    # render 'users/show'
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
    respond_to do |format|
      if @person.update_attributes(params[:person])
        if !params[:subject_id].nil?
          id = params[:subject_id]
          params.except!(:subject_id)
        else
          id = params[:id]
        end
        format.html {redirect_to :action => "edit", :id => id}
        format.json {render json: {:ok => 'ok'}}
      else
        format.html {render :action => "upload" }
        format.json {render json: @person.errors}
      end
    end

  end
end
