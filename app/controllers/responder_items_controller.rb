class ResponderItemsController < ApplicationController
  load_resource
  authorize_resource
  def index
  end

  def edit
    render :action => :index, :controller => :people #, :object => @person
    @responder_item = ResponderItem.find(params[:id])
    # @person = @responder_item.subject
    # render :action => :edit, :controller => :people, :object => @person
  end
  def update
  end

end
