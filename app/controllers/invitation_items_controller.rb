class InvitationItemsController < ApplicationController
  before_filter :get_user
  before_filter :get_responder_item
  before_filter :set_step, :only => [:new,:show,:create,:update]
  load_and_authorize_resource :responder_item, :parent => false

  respond_to :json



  def new
    @responder_item
    render "invitation_items/guardian_invitation/index"
  end

  def show
    @responder_item
    render "invitation_items/guardian_invitation/index"
  end

  def create
    @responder_item.save
    render "invitation_items/guardian_invitation/index"
  end

  def update
    if @responder_item.update_attributes(params[:responder_item])
      render "invitation_items/guardian_invitation/index"
    else
      render "invitation_items/guardian_invitation/index"
    end
  end
 

 private
  def set_step
    @step_no = params[:step_no] || 1
    KK.log @step_no
  end
  
  def get_responder_item
    KK.log params[:action]
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
    if params[:step_no]
      "invitation_items/guardian_invitation/step_#{params[:step_no]}/index"
    else
      "invitation_items/guardian_invitation/index"
    end
  end

end
