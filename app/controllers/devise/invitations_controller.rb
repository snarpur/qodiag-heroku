class Devise::InvitationsController < ApplicationController

  before_filter :get_user, :only => [:index,:new]
  before_filter :build_new_user, :only => [:new], :if => :logged_in?
  load_resource :user, :parent => false
  authorize_resource :user, :parent => false, :except => [:edit, :update]


  def new
    @user ||= User.new
    respond_to do |format|
      format.html
    end
  end

  def create
    @user = User.new(params[:user].merge!({:invitation => true}))
    @user.valid?
    if @user.errors.empty?
      User.invite_client_as_guardian(params[:user])
      flash[:notice] = I18n.t('devise.invitations.send_instructions',:email => @user.email)
      redirect_to after_sign_in_path_for(User)
    else
      render :action => :new
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
    def logged_in?
      !current_user.nil?
    end

    def get_user
      @current_user = current_user
    end

    def build_new_user
      @user = User.new_client_as_guardian_by_invitation({:role_ids => params[:role_ids], :inviter=> @current_user})
    end

end
