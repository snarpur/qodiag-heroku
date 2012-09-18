class PreRegistrationsController < ApplicationController
  respond_to :json 
  
  def index
    @pre_registration = PreRegistration.new()
  end

  def create
  
  end

  def edit
     @pre_registration = PreRegistration.new(params)
  end

  def update
    @pre_registration = PreRegistration.new(params)
    @pre_registration.update_attributes(pick_params(params[:content]))
  
  end
end