class UsersController < ApplicationController
  before_filter :get_user, :only => [:index,:new,:edit,:show]
  before_filter :accessible_roles, :only => [:new, :edit, :show, :update, :create]
  before_filter :create_user_with_role, :only => [:new]
  load_and_authorize_resource :only => [:show,:new,:destroy,:edit,:update]

  def index
    @users = User.all
     respond_to do |format|
       format.html
     end
  end

  def new
    @user.build_person
    respond_to do |format|
      format.html
    end
  end

  def show
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
end