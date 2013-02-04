class Devise::InvitationsController < ApplicationController
  before_filter :get_user
  before_filter :get_responder_item, :only =>[:new,:create]
  load_and_authorize_resource :responder_item, :parent => false, :except => [:edit, :update]

  respond_to :json

  def new
    @form_object = BackboneFormsPreprocessor::UserInvitation.new(params.merge!({:form_template => "guardian_invitation", :root_object => @responder_item}))
  end

  def create
    @form_object = BackboneFormsPreprocessor::UserInvitation.new(params.merge({:form_template => "guardian_invitation", :root_object => @responder_item}))   
    @form_object.validate   
    if @form_object.errors.empty?
      if @form_object.root_object.new_record?
        @form_object.root_object.save
      else
        @form_object.save_step(pick_params(params[:form_content]).first)
      end
        render 'devise/invitations/new.json.rabl' 
    else
      render 'devise/invitations/new.json.rabl' 
    end
  end

  def edit
    if params[:invitation_token] && @user = User.first(:conditions => { :invitation_token => params[:invitation_token] })
      render :edit
    else
      flash[:alert] = I18n.t('devise.invitations.invitation_token_invalid')
      redirect_to after_sign_out_path_for(User)
    end
  end

  def update
    @user = User.accept_invitation!(params[:user])
    if @user.errors.empty?
      flash[:notice] = I18n.t('devise.invitations.updated')
      sign_in_and_redirect(User, @user)
    else
      render :edit
    end
  end

  private
  def get_responder_item
    if params.has_key?(:form_content)
      @responder_item = ResponderItem.find_or_initialize_by_id(params[:form_content][:responder_item])
      @responder_item.caretaker_id=(@current_user.person.id) if @responder_item.new_record?
    elsif params.has_key?(:root_object_id)
      @responder_item = ResponderItem.find(params[:root_object_id])
    else
      @responder_item = ResponderItem.new({:caretaker_id => @current_user.person.id, :registration_identifier => "respondent_registration"})
    end
    ResponderItemDecorator.decorate(@responder_item)
  end

end
