class ApplicationController < ActionController::Base
  protect_from_forgery
  layout 'application'

  def index
    respond_to do |format|
      format.html # index.html.erb
    end
  end

  rescue_from CanCan::AccessDenied do |exception|
    flash[:error] = I18n.t("cancan.not_authorized")
    redirect_to root_url
  end
end