require 'ostruct'
class ResponderItemsController < ApplicationController
  before_filter :create_responder_item, :only => [:new,:create], :if => :logged_in?
  before_filter :set_role_to_respondent, :only => [:create], :if => :logged_in?
  before_filter :get_surveys, :only => [:survey] , :if => :logged_in?
  after_filter :add_subject_as_respondent, :only => [:create]
  load_and_authorize_resource :only => [:create]
  respond_to :json

  def index
    @person = Person.find(params[:subject_id])
    @responder_items = @person.responder_items.surveys
    authorize!(:survey, *(@responder_items.any? ? @responder_items : ResponderItem.new))
    @responder_items
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
    if @responder_item.save
      RequestNotice.request_survey(@responder_item).deliver
      render :json => @responder_item
    else
      respond_with @responder_item
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
  
  #REFACTOR: Move to SurveyResponsesController
  def responses 
    @chart = ResponderItem.to_line_chart(params)
    respond_to do |format|
      format.html
      format.json {render "show"}
    end
  end

  #REFACTOR: Move to SurveyResponsesController
  def survey
    @responder_items
    authorize!(:survey, *(!@responder_items.nil? && @responder_items.any? ? @responder_items : ResponderItem.new)) 
    @responder_items
  end
  
  private
  def create_responder_item
    params_without_root = params[:responder_item] || params
    attr_ok = ResponderItem._accessible_attributes[:default].to_a
    args = params_without_root.slice(*attr_ok)
    @responder_item = ResponderItem.new_patient_item(args,current_user.person)
  end

  def get_surveys
    @person = Person.find(params[:subject_id])
    @responder_items = @person.responder_items.surveys_by_id(params[:survey_id])
  end

  def is_caretaker?(responder_item)
    (@current_user.person_id ==  @responder_item.caretaker_id)
  end

  def is_subject_registration?(responder_item)
    (responder_item.registration_identifier.present? and responder_item.registration_identifier ==  "subject_registration")
  end

  def is_guardian_registration?(responder_item)
    (responder_item.registration_identifier.present? and responder_item.registration_identifier ==  "respondent_registration")
  end

  def add_subject_as_respondent
    if is_caretaker?(@responder_item) and is_subject_registration?(@responder_item)
      @responder_item.update_attributes(:respondent_id => @responder_item.subject_id,:invite_respondent_user => true) 
    end
  end

  def set_role_to_respondent
    if is_subject_registration?(@responder_item)
      @responder_item.subject.user.set_role("respondent")
    else
      if is_guardian_registration?(@responder_item)
        @responder_item.respondent.user.set_role("respondent")
      end
    end
  end

  def send_email_notification
    RequestNotice.request_survey(@responder_item).deliver
  end

end
