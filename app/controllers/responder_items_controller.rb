require 'ostruct'
class ResponderItemsController < ApplicationController
  before_filter :create_responder_item, :only => [:new,:create]
  load_and_authorize_resource
  respond_to :json

  def index
    @person = Person.find(params[:subject_id])
    @responder_items = @person.responder_items.surveys
    respond_to do |format|
      format.html
      format.json
    end
  end

  def show
    @chart = ResponderItem.find(params[:id]).response_to_chart(params.slice(:result_name))
  end

  def new
    @responder_item ||= ResponderItem.new

  end

  def create
    if @responder_item.save!
      RequestNotice.request_survey(@responder_item).deliver
      #respond_to do |format|
        #format.json {render :json => @responder_item}
        render "create"
      #end 
    else
      #respond_to do |format|
        #format.json {render :json => {:errors => @responder_item.errors}}
        render :json => {:errors => @responder_item.errors}
      #end
    end
  end

  def edit
    @responder_item = ResponderItem.find(params[:id])
  end

  def update
     @responder_item = ResponderItem.find(params[:id])

    respond_to do |format|
      if @responder_item.update_attributes(params[:responder_item])
        format.html { redirect_to(@current_user) }
      else
        format.html { render :action => "edit" }
      end
    end

  end
  
  def responses 
    @chart = ResponderItem.to_line_chart(params)
    respond_to do |format|
      format.html
      format.json {render "show"}
    end
  end
 
  def survey
    @person = Person.find(params[:subject_id])
    @responder_items = @person.responder_items.surveys_by_id(params[:survey_id])
  end
  
  private
  def create_responder_item
    params_without_root = params[:responder_item] || params
    attr_ok = ResponderItem._accessible_attributes[:default].to_a
    args = params_without_root.slice(*attr_ok)
    @responder_item = ResponderItem.new_patient_item(args,current_user.person)
  end

end
