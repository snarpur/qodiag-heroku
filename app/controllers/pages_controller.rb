class PagesController < ApplicationController

  
  def error_401

  end

  def help
    render :layout => 'application'
  end

  def landing
    render :layout => 'login'
  end

  def browser_update
  	render :layout => 'simple_layout'
  end


end