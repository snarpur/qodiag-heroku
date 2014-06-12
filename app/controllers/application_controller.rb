class ApplicationController < ActionController::Base
  protect_from_forgery
  layout :set_layout
  before_filter :unauthorized_raise_401
  before_filter :get_user
  before_filter :set_layout

  def index
    if logged_in?
      gon.rabl
      @user = UserDecorator.decorate(get_user)
      gon.rabl "app/views/users/show.json.rabl", as: "current_user"
    else
      redirect_to new_user_session_path()
    end
  end

  rescue_from CanCan::AccessDenied do |exception|
    error_page("401")
    warden.custom_failure! if performed?
  end

  private

  def error_page(error)
    render "pages/#{error_partial}", :status => 401
  end
  

  def error_partial
    logged_in? ? "error_401" : "error_401_login"  
  end
  
  def get_user
    @current_user = current_user
  end

  def unauthorized_raise_401
    raise CanCan::AccessDenied unless logged_in?
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

  def redirect_to_sign_in
    redirect_to new_user_session_path() unless logged_in? 
  end

  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path()
  end

  def application_layout
    # params[:action] == 'index' ? 'marionette_application' : 'application'
    params[:action] == 'index' ? 'marionette_flatlab_application' : 'flatlab_application'
  end

  def pick_params(params,class_name=nil)
   if class_name.nil?
      params.map do |k,v|
        # REFACTOR: It could be a hole security (http://www.sitepoint.com/rails-security-pitfalls/)
        accessible_attr = eval(k.classify)._accessible_attributes[:default].to_a
        {k.to_sym => v.with_indifferent_access.slice(*accessible_attr)}
      end
    else
      # REFACTOR: It could be a hole security (http://www.sitepoint.com/rails-security-pitfalls/)
      accessible_attr = eval(class_name.classify)._accessible_attributes[:default].to_a
      params.with_indifferent_access.slice(*accessible_attr)
    end
  end
end