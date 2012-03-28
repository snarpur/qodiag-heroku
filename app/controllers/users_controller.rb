class UsersController < ApplicationController

  before_filter :get_user, :only => [:index,:new,:edit,:show]
  before_filter :accessible_roles, :only => [:new, :edit, :show, :update, :create]
  before_filter :create_user_with_role, :only => [:new]
  before_filter :redirect_if_admin, :only => [:show]
  load_and_authorize_resource :only => [:new,:destroy,:edit,:update]


  def new
    @user.build_person
    respond_to do |format|
      format.html
    end
  end

  def show
    unless user_signed_in?
      redirect_to new_user_session_url 
    else
      @patients = @current_user.person.relations.patients
      respond_to do |format|
        format.html
      end
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
    @user = User.new
    role = Role.find_by_name(params[:role_name])
    @user.roles << role
  end

  def redirect_if_admin
   unless current_user.nil?
    redirect_to admin_users_path if current_user.role?('super_admin') end
  end
end