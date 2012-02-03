class ResponderItemsController < ApplicationController
  before_filter :create_responder_item, :only => [:new,:create]
  load_and_authorize_resource

  def index
    @person = Person.find(params[:subject_id])
    @responder_items = @person.responder_items.surveys

    respond_to do |format|
      format.html
      format.json {render :json => @responder_items }
    end
  end

  def show
    respond_to do |format|
      format.html
      format.json {render :json => ResponderItem.to_chart(params).to_json}
    end
  end

  def new
    @responder_item ||= ResponderItem.new
  end

  def create
    @responder_item
    if @responder_item.save!
      #RequestNotice.request_survey(@responder_item).deliver
      #redirect_to(person_path(@responder_item.subject), :notice => I18n.t('responder_item.messages.requested'))
      respond_to do |format|
        format.json {render :json => @responder_item}
      end
    else
      respond_to do |format|
        format.json {render :json => {:message => "error in create"}}
      end
    end
  end

  def edit
    @responder_item = ResponderItem.find(params[:id])
  end

  def update
  end
  
  # Should be moved to a response_set controller
  def responses 
    respond_to do |format|
      format.html
      format.json {render :json => ResponderItem.to_chart(params).to_json}
    end
  end

  def survey
    @person = Person.find(params[:subject_id])
    @responder_items = @person.responder_items.surveys_by_id(params[:survey_id])
    respond_to do |format|
      format.html
      format.json {render :json => @responder_items}
    end
  end

  private
  def create_responder_item
    args = params[:responder_item].nil? ? params : params[:responder_item]
    @responder_item = current_user.person.new_patient_request(args)
  end

end
