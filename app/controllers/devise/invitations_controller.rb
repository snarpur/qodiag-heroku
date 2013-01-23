class Devise::InvitationsController < ApplicationController
  before_filter :get_user


  #DELETE: build_new_user before filter
  # before_filter :build_new_user, :only => [:new], :if => :logged_in?
  before_filter :role_invitation, :only =>[:new,:create], :if => :logged_in?
  authorize_resource :ResponderItem, :parent => false, :except => [:edit, :update]
  load_resource :ResponderItem, :parent => false
  respond_to :json

  def new
    root_params = {:registration_identifier => :respondent_registration, :id => params[:root_object_id], :caretaker_id => @current_user.person.id}
    @root_object = ResponderItemDecorator.decorate(ResponderItem.find_or_initialize_by_id(root_params))
    @form_object = BackboneFormsPreprocessor::UserInvitation.new(params.merge!({:form_template => "guardian_invitation", :root_object => @root_object, :invited_by => @current_user}))
  end

  def create
    @form_object = BackboneFormsPreprocessor::UserInvitation.new(params.merge({:form_template => "guardian_invitation" }))   
    @form_object.validate   
    if @form_object.errors.empty?
      if @form_object.root_object.new_record?
        @form_object.root_object.save
      else
        @form_object.save_step(pick_params(params[:form_content]).first)
      end
      render 'devise/invitations/new'
    else
      render 'devise/invitations/new'
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
    def role_invitation
      @role_name = Role.find(params[:role_ids].first).name
    end

    def build_new_user
      @user = User.new_respondent_as_guardian_by_invitation({ :role_ids => params[:role_ids],
                                                              :inviter=> @current_user})
    end

end
