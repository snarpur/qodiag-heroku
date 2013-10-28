class PagesController < ApplicationController
  before_filter :unauthorized_raise_401, :except => ['landing','browser_update','error_401']

  def error_401

  end

  def help
    if @current_user.nil?
      redirect_to new_user_session_path, :notice => I18n.t('devise.failure.unauthenticated')
    else
      if @current_user.is_caretaker? or @current_user.is_superadmin?
        render :layout => 'application'
      else
        redirect_to root_path, :notice => I18n.t('page_errors.error_401')
      end
    end
  end

  def landing
    render :layout => 'login'
  end

  def browser_update
  	render :layout => 'simple_layout'
  end

end