class PreRegistrationsController < ApplicationController
  load_and_authorize_resource :responder_item, :parent => false

  respond_to :json


  def create

  end

  def edit
    @pre_registration = BackboneFormsPreprocessor::PreRegistration.new(params.merge({:form_template => 'respondent_registration'}))
  end

  def update
    @pre_registration = BackboneFormsPreprocessor::PreRegistration.new(params.merge({:form_template => 'respondent_registration'}))
    @pre_registration.update_attributes(pick_params(params[:content]))
  end


end
