class RolesController < ApplicationController
  def index
  end

  def show
  end

  def edit
  end

  def update
  end

  def create
    @role = Role.new(params[:role])

    respond_to do |format|
      if @role.save
        format.html { redirect_to(@role, :notice => 'Role was successfully created.') }
      else
        format.html { render :action => "new" }
      end
    end
  end

  def new
    @role = Role.new
    respond_to do |format|
      format.html # new.html.erb
    end
  end

end
