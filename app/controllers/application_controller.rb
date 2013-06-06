class ApplicationController < ActionController::Base
  protect_from_forgery
  layout :set_layout
  before_filter :get_user
  before_filter :set_layout
  def index
    gon.rabl
    @user = UserDecorator.decorate(get_user)
    gon.rabl "app/views/users/show.json.rabl", as: "current_user"
  end

  rescue_from CanCan::AccessDenied do |exception|
    error_page("401")
    warden.custom_failure! if performed?
  end

  private
  def error_page(error)
    flash.now[:alert] = I18n.t("page_errors.error_#{error}")
    render "pages/error_401", :status => 401
  end
  
private
  def get_user
    @current_user = current_user
  end

  def set_layout
    if logged_in?
      application_layout
    else
      'login'
    end

  end

  def logged_in?
    !current_user.nil?
  end

  def application_layout
    params[:action] == 'index' ? 'marionette_application' : 'application'
  end

  def pick_params(params,class_name=nil)
   if class_name.nil?
      params.map do |k,v|
        accessible_attr = eval(k.classify)._accessible_attributes[:default].to_a
        {k.to_sym => v.with_indifferent_access.slice(*accessible_attr)}
      end
    else
      accessible_attr = eval(class_name.classify)._accessible_attributes[:default].to_a
      params.with_indifferent_access.slice(*accessible_attr)
    end
  end
end
