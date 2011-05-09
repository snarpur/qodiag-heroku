class PeopleController < ApplicationController

  def edit
    @person = Person.find(params[:id])
    if params[:responder_item_id]
      @responder_item = ResponderItem.find(params[:responder_item_id])
    end
  end

  def update
    @person = Person.find(params[:id])

    respond_to do |format|
      if @person.update_attributes(params[:person])
        format.html { redirect_to(users_path, :notice => 'Registration completed') }
      else
        format.html { render :action => "edit" }
      end
    end
  end

end
