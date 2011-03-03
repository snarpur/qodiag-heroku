class ApplicationController < ActionController::Base
  protect_from_forgery
  layout 'application'
  
  def index
    respond_to do |format|
      format.html # index.html.erb
    end
  end
end