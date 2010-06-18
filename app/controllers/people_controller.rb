class PeopleController < ApplicationController
  # GET /people
  def index
    @people = Person.all

    respond_to do |format|
      format.html 
    end
  end

  # GET /people/1
  def show
    @person = Person.find(params[:id])

    respond_to do |format|
      format.html 
    end
  end

  # GET /people/new
  def new
    
    @current_step = params[:current_step] == nil ? "patient" : params[:current_step]
    session[:patient] = nil if @current_step == "patient" 
    logger.debug "xx session[:patient] is: #{session[:patient]}"
    @patient = Person.find(session[:patient]) if session[:patient] != nil
      
  
    
    @person = Person.new
    @person.relationships.build

    respond_to do |format|
      format.html 
    end
  end

  # GET /people/1/edit
  def edit
    @person = Person.find(params[:id])
  end

  # POST /people  
  def create
    @person = Person.new(params[:person]) 
    
      
    respond_to do |format|
      if @person.save
        if @person.ispatient
          session[:patient] = @person.id
        end
        format.html {redirect_to url_for_next_step(params[:next_step])}
      else
        format.html { render :action => "index" }
        
      end
    end
  end

  # PUT /people/1
  # PUT /people/1.xml
  def update
    @person = Person.find(params[:id])

    respond_to do |format|
      if @person.update_attributes(params[:person])
        format.html { redirect_to(@person, :notice => 'Person was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @person.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /people/1
  # DELETE /people/1.xml
  def destroy
    @person = Person.find(params[:id])
    @person.destroy

    respond_to do |format|
      format.html { redirect_to(people_url) }
      format.xml  { head :ok }
    end
  end
  
  private 
  
  def url_for_next_step(next_step)
    if next_step != "finnish"
      url_for :controller => "people", :action => "new", :current_step => next_step
    else
      url_for :controller => "people", :action => "show", :id => session[:patient]
    end
  end
  
end
