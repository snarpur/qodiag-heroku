class PeopleController < ApplicationController
  # GET /people
  # GET /people.xml
  def index
    @people = Person.all

    respond_to do |format|
      format.html 
    end
  end

  # GET /people/1
  # GET /people/1.xml
  def show
    @person = Person.find(params[:id])

    respond_to do |format|
      format.html 
    end
  end

  # GET /people/new
  # GET /people/new.xml
  def new
    session[:patient] ||= {}
    session[:current_step] = params[:current_step] == nil ? "patient" : params[:current_step]
    @patient = Person.find_by_id(session[:patient])
    @person = Person.new
    @person.relations.build

    respond_to do |format|
      format.html 
    end
  end

  # GET /people/1/edit
  def edit
    @person = Person.find(params[:id])
  end

  # POST /people
  # POST /people.xml
  def create
    @person = Person.new(params[:person])
    session[:current_step] = params[:next_step] 
    
      
    respond_to do |format|
      if @person.save
        if @person.ispatient
          session[:patient] = @person.id
          @patient = @person
        end
        redirect_to url_for "people#new"
        
      else
        format.html { render :action => "new" }
        
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
end
