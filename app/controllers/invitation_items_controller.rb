class InvitationItemsController < ApplicationController
  before_filter :get_user
  before_filter :get_responder_item, :if => :logged_in?
  before_filter :set_step, :only => [:new,:show,:create,:update]

  after_filter :add_subject_as_respondent, :only => [:create] 
  load_and_authorize_resource :responder_item, :parent => false

  respond_to :json



  def new
    @responder_item
    if params[:type].present? and params[:type] == "subject"
      render "invitation_items/subject_invitation/index"
    else
      render "invitation_items/guardian_invitation/index"
    end
  end

  def show
    @responder_item
    render "invitation_items/guardian_invitation/index"
  end

  def create
    @responder_item.save
    if is_subject_registration?(@responder_item)
      render "invitation_items/subject_invitation/index"
    else
      render "invitation_items/guardian_invitation/index"
    end
  end

  def update
    if @responder_item.update_attributes(params[:responder_item])
      render "invitation_items/guardian_invitation/index"
    else
      render "invitation_items/guardian_invitation/index"
    end
  end
 

 private

  def is_caretaker?(responder_item)
    (@current_user.person_id ==  @responder_item.caretaker_id)
  end

  def is_subject_registration?(responder_item)
    (responder_item.registration_identifier.present? and responder_item.registration_identifier ==  "subject_registration")
  end

  def add_subject_as_respondent
    if is_caretaker?(@responder_item) and is_subject_registration?(@responder_item)
      @responder_item.update_attributes(:respondent_id => @responder_item.subject_id,:invite_respondent_user => true) 
    end
  end

  def set_step
    @step_no = params[:step_no] || 1
  end
  
  def get_responder_item
    if params[:action] == 'new'
      # args = {:caretaker_id => @current_user.person.id, :registration_identifier => "respondent_registration"}
      if params[:type].present? and params[:type] == "subject"
        args = {:caretaker_id => @current_user.person.id, :registration_identifier => "subject_registration"}
      else
        args = {:caretaker_id => @current_user.person.id, :registration_identifier => "respondent_registration"}
      end
      @responder_item = ResponderItem.new(args)
    elsif params[:action] == 'create'
      @responder_item = ResponderItem.new(params[:responder_item])
    else
      @responder_item = ResponderItem.find(params[:id])
    end
    @responder_item = ResponderItemDecorator.decorate(@responder_item)
  end

  def view_template
    if params[:step_no]
      "invitation_items/guardian_invitation/step_#{params[:step_no]}/index"
    else
      "invitation_items/guardian_invitation/index"
    end
  end

end
