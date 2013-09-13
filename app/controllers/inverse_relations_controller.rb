class InverseRelationsController < ApplicationController
  # before_filter :get_user
  #load_and_authorize_resource
  respond_to :json
  
  def show
    @person = Person.find(params[:id])
    @inverse_relations = PeopleDecorator.decorate @person.inverse_relations.send(params[:relationship_name])
  end

  def update

    @person = Person.find(params[:id])
    @person.update_attributes(params[:person])
    render :json => {:ok => 'ok'}
  end

end