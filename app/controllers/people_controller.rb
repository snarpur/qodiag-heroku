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

  def upload
    @person = Person.find(params[:subject_id])
  end

  
  def update
    @person= Person.find(params[:id])
    respond_to do |format|
      if @person.update_attributes(params[:person])
        format.html {redirect_to :action => "edit", :id => params[:id]}
        format.json {render :template => "people/edit"}
      else
        format.html { render :action => "upload" }
        format.json {render :template => "people/edit"}
      end
    end

  end
end
