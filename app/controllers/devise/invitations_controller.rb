class Devise::InvitationsController < ApplicationController

  before_filter :get_user
  before_filter :build_new_user, :only => [:new], :if => :logged_in?
  load_resource :user, :parent => false
  authorize_resource :user, :parent => false, :except => [:edit, :update]
  respond_to :json

  def new
    responder_item = ResponderItem.new({:caretaker_id => @current_user.person.id, :registration_identifier => "respondent_registration" })
    params = {:root_object => responder_item,:step_no => 1, :form_template => 'guardian_invitation'}
    @form_preprocessor = BackboneFormsPreprocessor::Base.new(params)

  end

  def create
    params.merge!({:form_template => 'guardian_invitation'})
    @form_preprocessor =  BackboneFormsPreprocessor::UserInvitation.new(params)
    @form_preprocessor.validate
    KK.log "@form_preprocessor.errors.empty? #{@form_preprocessor.errors.empty?}",:g
    if @form_preprocessor.errors.empty?
      @form_preprocessor.root_object.save
      @form_preprocessor.user.invite!(@current_user)
      # flash[:notice] = I18n.t('devise.invitations.send_instructions',:email => @user.email)
      # redirect_to after_sign_in_path_for(User)
    else
      KK.log "renderting in g elese #{@form_preprocessor.user}"
      render 'devise/invitations/new'
    end

    # if @user.errors.empty?
    #   User.invite_respondent_as_guardian(params[:user])
    #   flash[:notice] = I18n.t('devise.invitations.send_instructions',:email => @user.email)
    #   redirect_to after_sign_in_path_for(User)
    # else
    #   render :action => :new
    # end
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
    def logged_in?
      !current_user.nil?
    end

    def get_user
      @current_user = current_user
    end

    def build_new_user
      @user = User.new_respondent_as_guardian_by_invitation({ :role_ids => params[:role_ids],
                                                              :inviter=> @current_user})
    end

end
