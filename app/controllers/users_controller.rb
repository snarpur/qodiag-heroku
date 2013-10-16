class UsersController < ApplicationController

  # DELETE: Refactor after writing test
  # before_filter :get_user, :only => [:index,:new,:edit,:show]
  # before_filter :redirect_to_sign_in
  # before_filter :accessible_roles, :only => [:new, :edit, :show, :update, :create]
  # before_filter :create_user_with_role, :only => [:new]
  # before_filter :redirect_if_admin, :only => [:show]
  # before_filter :redirect_to_respondent_home, :only => [:show]
  # load_and_authorize_resource :only => [:new,:destroy,:edit,:update]

  
  before_filter :get_user, :only => [:show]
  before_filter :redirect_to_sign_in
  before_filter :accessible_roles, :only => [:show]
  before_filter :redirect_if_admin, :only => [:show]
  before_filter :redirect_to_respondent_home, :only => [:show]


  # DELETE: Refactor after writing test
  # def new
  #   @user.build_person
  #   respond_to do |format|
  #     format.html
  #   end
  # end

  def show
    @patients = @current_user.person.relations.patients
    respond_to do |format|
      format.html
    end
  end

  # DELETE: Refactor after writing test
  # def index

  # end


  private
  def accessible_roles
    @accessible_roles = Role.accessible_by(current_ability,:read)
  end

  # Make the current user object available to views
  #----------------------------------------
  def get_user
    @current_user = current_user
  end

  # DELETE: Refactor after writing test
  # def create_user_with_role
  #   @user = User.new
  #   role = Role.find_by_name(params[:role_name])
  #   @user.roles << role
  # end

  def redirect_if_admin
   unless current_user.nil?
    redirect_to admin_users_path, notice: I18n.t('devise.sessions.signed_in') if current_user.role?('super_admin') end
  end

  def is_respondent?
    @current_user.role_names.include? 'respondent'
  end

  def redirect_to_respondent_home
    redirect_to "/#items" if is_respondent?
  end

end
