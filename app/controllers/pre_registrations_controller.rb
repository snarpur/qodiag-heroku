class PreRegistrationsController < ApplicationController
  before_filter :get_user
  before_filter :get_responder_item
  before_filter :set_step, :onley => [:new,:show]
  load_and_authorize_resource :responder_item, :parent => false

  respond_to :json


  def show
    @responder_item
  end

  def update
    @responder_item.update_attributes(params[:responder_item])
    render "#{@responder_item.pre_registration_template}/show"
  end

  private
  def set_step
    @step_no = params[:step_no] || 1
  end
  
  def get_responder_item
    if params[:action] == 'new'
      args = {:caretaker_id => @current_user.person.id, :registration_identifier => "respondent_registration"}
      @responder_item = ResponderItem.new(args)
    elsif params[:action] == 'create'
      @responder_item = ResponderItem.new(params[:responder_item])
    else
      @responder_item = ResponderItem.find(params[:id])
    end
    @responder_item = ResponderItemDecorator.decorate(@responder_item)
  end

  def view_template
    if parms[:step_no]
      "#{@responder_item.pre_registration_template}/step_#{parms[:step_no]}/show"
    else
      "#{@responder_item.pre_registration_template}/show"
    end
  end


end
