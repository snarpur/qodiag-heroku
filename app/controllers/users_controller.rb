class UsersController < ApplicationController

  before_filter :get_user, :only => [:show]
  before_filter :redirect_to_sign_in
  before_filter :accessible_roles, :only => [:show]
  before_filter :redirect_if_admin, :only => [:show]
  before_filter :redirect_to_respondent_home, :only => [:show]

  def show
    @patients = PersonDecorator.decorate_collection(@current_user.person.relations.patients)
    respond_to do |format|
      format.html
    end
  end

  private
  def accessible_roles
    @accessible_roles = Role.accessible_by(current_ability,:read)
  end

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
