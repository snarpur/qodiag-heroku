class ResponderItemsController < ApplicationController
  before_filter :create_responder_item, :only => :new
  load_and_authorize_resource

  def index
    @responder_items = @current_user.person.responder_items_by_group
    respond_to do |format|
      format.html
      format.json {render :json => @responder_items }
    end
  end

  def show
    @responder_item = ResponderItem.find(params[:id])
    respond_to do |format|
      format.html
      format.json {render :json => @responder_item.result.to_json}
    end
  end

  def new
    @responder_item ||= ResponderItem.new
  end

  def create
    @responder_item = ResponderItem.new(params[:responder_item])
    if @responder_item.save
      RequestNotice.request_survey(@responder_item).deliver
      redirect_to(person_path(@responder_item.subject), :notice => I18n.t('responder_item.messages.requested'))
    else
      render :action => :new
    end
  end

  def edit
    @responder_item = ResponderItem.find(params[:id])
  end

  def update
  end

  private
  def create_responder_item
    @responder_item = current_user.person.new_patient_request(params[:person_id])

  end

end
