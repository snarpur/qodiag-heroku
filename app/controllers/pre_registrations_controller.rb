class PreRegistrationsController < ApplicationController
  load_and_authorize_resource :responder_item, :parent => false

  respond_to :json


  def create

  end

  def edit
    responder_item = ResponderItemDecorator.decorate(ResponderItem.find(params[:id]))
    params.merge!({:form_template => 'respondent_registration', :root_object => responder_item})
    @pre_registration = BackboneFormsPreprocessor::PreRegistration.new(params)
  end

  def update
    @pre_registration = BackboneFormsPreprocessor::PreRegistration.new(params.merge({:form_template => 'respondent_registration'}))  
    @pre_registration.validate   
    if @pre_registration.errors.empty?
      if @pre_registration.root_object.new_record?
        @pre_registration.root_object.save
      else
        @pre_registration.save_step(pick_params(params[:form_content]).first)
      end
      render 'pre_registrations/edit'
    else
      render 'pre_registrations/edit'
    end

  end


end
