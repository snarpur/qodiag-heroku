class PeopleController < ApplicationController
  before_filter :get_user
  load_and_authorize_resource
  
  def edit
    @person = Person.find(params[:id])
    if params[:responder_item_id]
      @responder_item = ResponderItem.find(params[:responder_item_id])
    end
  end
  
  def show
    @person = Person.find(params[:id])
    respond_to do |format|
      format.html
      format.json
    end
  end

  #FIXME: CLEAR debugging log messages when refactoring is complete
  def update
    @person = Person.find(params[:id])
    picked_params = pick_params(params,'Person')
    respond_to do |format|
      if @person.update_attributes(picked_params)
        format.html { redirect_to(users_path, :notice => 'Registration completed') }
        format.json
      else
        format.html { render :action => "edit" }
        format.json
      end
    end
  end
  

end
