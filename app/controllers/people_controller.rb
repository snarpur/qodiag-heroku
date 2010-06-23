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
    session[:wizard] = Wizard.new if Integer(params[:step]) == 1
    
    @wizard = session[:wizard]
    @wizard.step(Integer(params[:step]))
    @patient = get_patient
    @person = Person.new
    @person.relationships.build
    
   

    respond_to do |format|
      format.html 
    end
  end

  # GET /people/1/edit
  def edit
    @person = Person.find(params[:id])
    @wizard = session[:wizard]
    @wizard.step(Integer(params[:step]))
    @patient = get_patient
  end

  # POST /people  
  def create
    @person = Person.new(params[:person]) 
    
    respond_to do |format|
      if @person.save
        if @person.ispatient
          session[:wizard] = Wizard.new(@person.id)
        end
        if session[:wizard]
          #format.html {redirect_to url_for_next_step(params[:next_step])}
          format.html {redirect_to url_for_next_step }
        else
          format.html { redirect_to(@person, :notice => 'Relationship was successfully created.') }
        end
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
  
  def url_for_next_step
    if session[:wizard].next_is_last? 
      url_for :controller => "people", :action => "show", :id => session[:wizard].patient_id
    else
      url_for :controller => "people", :action => "new", :step => session[:wizard].next_step_no
    end
  end
  
  def get_patient
    patient = @wizard.patient_id == nil ? Person.new : Person.find(@wizard.patient_id)
  end
  
end
