class InvitationItemsController < ApplicationController
  before_filter :get_user
  before_filter :create_responder_item, :only => [:create], :if => :logged_in?
  before_filter :set_role_to_respondent, :only => [:create], :if => :logged_in?
  before_filter :set_type, :only => [:show,:create,:update]
  before_filter :set_step, :only => [:show,:create,:update]
  after_filter :add_subject_as_respondent, :only => [:create]
  load_and_authorize_resource :responder_item, :parent => false
  skip_load_resource :responder_item, :only => [:show]

  respond_to :json


  def show
    if ResponderItem.exists?(params[:id])
      @responder_item = ResponderItemDecorator.decorate(ResponderItem.find(params[:id]))
    else
      @responder_item = ResponderItemDecorator.decorate(ResponderItem.new)
      #NOTE: If there in no RespoderItem, the step should be always 1
      @step_no = 1
    end
    render "invitation_items/#{@type}_invitation/step_#{@step_no}/index"
  end

  def create
    if @responder_item.save
      if is_subject_registration?(@responder_item)
        RequestNotice.request_invitation(@responder_item.subject).deliver
      else
        RequestNotice.request_invitation(@responder_item.respondent).deliver
      end
      render :json => @responder_item
    else
      respond_with @responder_item
    end
  end

  def update
    if @responder_item.update_attributes(params[:responder_item])
      render :json => @responder_item
    else
      respond_with @responder_item
    end
  end
 

private

  def object_exists?
    ResponderItem.exists?(params[:id])
  end

  def create_responder_item
    params_without_root = params[:responder_item] || params
    attr_ok = ResponderItem._accessible_attributes[:default].to_a
    args = params_without_root.slice(*attr_ok)
    @responder_item = ResponderItem.new_patient_item(args,current_user.person)
  end

  def set_role_to_respondent
    if is_subject_registration?(@responder_item)
      @responder_item.subject.user.set_role("respondent")
    else
      if is_guardian_registration?(@responder_item)
        @responder_item.respondent.user.set_role("respondent")
      end
    end
  end

  def is_caretaker?(responder_item)
    (@current_user.person_id ==  @responder_item.caretaker_id)
  end

  def is_subject_registration?(responder_item)
    (responder_item.registration_identifier.present? and responder_item.registration_identifier ==  "subject_registration")
  end

  def is_guardian_registration?(responder_item)
    (responder_item.registration_identifier.present? and responder_item.registration_identifier ==  "respondent_registration")
  end

  def add_subject_as_respondent
    if is_caretaker?(@responder_item) and is_subject_registration?(@responder_item)
      @responder_item.update_attributes(:respondent_id => @responder_item.subject_id,:invite_respondent_user => true) 
    end
  end

  def set_step
    @step_no = params[:step_no] || 1
  end

  def set_type
    @type = params[:type] || "guardian"
  end
  
end
