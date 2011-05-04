class ApplicationController < ActionController::Base
  protect_from_forgery
  layout 'application'
  def index
    respond_to do |format|
      format.html # index.html.erb
    end
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
end