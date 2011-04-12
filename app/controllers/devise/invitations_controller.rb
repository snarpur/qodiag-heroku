class Devise::InvitationsController < ApplicationController
  before_filter :get_user, :only => [:index,:new]
  before_filter :accessible_roles, :only => [:new, :show, :update, :create]
  load_resource :user, :parent => false
  authorize_resource :user, :parent => false, :except => [:new, :create, :edit, :update]
  before_filter :create_user_with_role, :only =>  [:new]

  def new
    KK.see @items.inspect
    respond_to do |format|
      format.html
    end
  end

  def create
    #@user = User.invite!(params[:user])
    @user = User.new(params[:user])
    @user.save
    logger.ap @user.errors
    if @user.errors.empty?
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
  def accessible_roles
    @accessible_roles = Role.accessible_by(current_ability,:read)
  end

  # Make the current user object available to views
  #----------------------------------------
  def get_user
    @current_user = current_user
  end

  def create_user_with_role
    @user.roles << Role.find(params[:role_ids])
    @items = AssociationFactory.new(:client_as_parent_invitation, {:user => @user, :current_user => @current_user}).items
  end
end
