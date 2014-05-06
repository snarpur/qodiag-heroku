module SurveyorControllerCustomMethods
  def self.included(base)
    base.send :before_filter, :get_user
    base.send :before_filter, :get_response_set, :only => [:update]
    base.send :load_resource, :response_set, :except => [:index]
    base.send :authorize_resource, :response_set, :except => [:index]
    base.send :layout, "surveyor_custom", :except => [:index]
  end

  # Actions

  def index
    @surveys = Survey.find(:all)
    
    respond_to do |format|
      format.html
      format.json
    end
  end

  def new
    @surveys = Survey.find(:all)
    @title = "You can take these surveys"
    redirect_to surveyor_index unless surveyor_index == available_surveys_path
  end

  def create
    @survey = Survey.find_by_access_code(params[:survey_code])
    @response_set = ResponseSet.create(:survey => @survey, :user_id => (@current_user.nil? ? @current_user : @current_user.id))

    if (@survey && @response_set)
      flash[:notice] = t('surveyor.survey_started_success')
      redirect_to(edit_my_survey_path(:survey_code => @survey.access_code, :response_set_code  => @response_set.access_code))
    else
      flash[:notice] = t('surveyor.Unable_to_find_that_survey')
      redirect_to surveyor_index
    end
  end


  def edit
    @response_set = ResponseSet.find_by_access_code(params[:response_set_code], :include => {:responses => [:question, :answer]})
    if @response_set
      redirect_to root_path unless @response_set[:completed_at].nil?
      @survey = Survey.with_sections.find_by_id(@response_set.survey_id)
      @sections = @survey.sections
      if params[:section]
        @section = @sections.with_includes.find(section_id_from(params[:section])) || @sections.with_includes.first
      else
        @section = @sections.with_includes.first
      end
      @dependents = (@response_set.unanswered_dependencies - @section.questions) || []
    else
      flash[:notice] = t('surveyor.unable_to_find_your_responses')
      redirect_to surveyor_index
    end
  end

  def update

    @response_set = ResponseSet.find_by_access_code(params[:response_set_code], :include => {:responses => :answer}, :lock => true)
    if @response_set
      if not @response_set[:completed_at].nil?
        redirect_to root_path
        return
      end
      @survey = Survey.with_sections.find_by_id(@response_set.survey_id)
      @sections = @survey.sections
      if params[:section]
        @section = @sections.with_includes.find(section_id_from(params[:section])) || @sections.with_includes.first
      else
        @section = @sections.with_includes.first
      end
      @dependents = (@response_set.unanswered_dependencies - @section.questions) || []
    end
    return redirect_with_message(available_surveys_path, :notice, t('surveyor.unable_to_find_your_responses')) if @response_set.blank?
    saved = false
    ActiveRecord::Base.transaction do
      saved = @response_set.update_attributes(:status => params[:finish],:responses_attributes => params[:r])
      @response_set.complete! if saved && params[:finish]
       saved &= @response_set.save
    end
    return redirect_with_message(user_path(@current_user), :notice, t('surveyor.completed_survey')) if saved && params[:finish]

    respond_to do |format|
      format.html do
        flash[:notice] = t('surveyor.unable_to_update_survey') unless saved
        render :edit
      end
      format.js do
        ids, remove, question_ids = {}, {}, []
        ResponseSet.reject_or_destroy_blanks(params[:r]).each do |k,v|
          ids[k] = @response_set.responses.find(:first, :conditions => v).id if !v.has_key?("id")

          remove[k] = v["id"] if v.has_key?("id") && v.has_key?("_destroy")
          question_ids << v["question_id"]
        end
        render :json => {"ids" => ids, "remove" => remove}.merge(@response_set.reload.all_dependencies(question_ids))
      end
    end
  end

  private
    def get_user
      @current_user = current_user
    end

    def create_response_set
      @survey = Survey.find_by_access_code(params[:survey_code])
      @response_set = ResponseSet.create(:survey => @survey, :user_id => (@current_user.nil? ? @current_user : @current_user.id))
    end
    def get_response_set
      @response_set = ResponseSet.find_by_access_code(params[:response_set_code], :include => {:responses => [:question, :answer]})
    end
    
end
class SurveyorController < ApplicationController
  include Surveyor::SurveyorControllerMethods
  include SurveyorControllerCustomMethods
end