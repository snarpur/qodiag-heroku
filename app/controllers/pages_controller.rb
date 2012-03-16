class PagesController < ApplicationController

  
  def error_401

  end

  def help
  end

  def browser_update
  	render :layout => 'simple_layout'
  end


end