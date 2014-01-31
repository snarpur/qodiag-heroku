class ResponderItem < ActiveRecord::Base
  belongs_to :person
  belongs_to :respondent, :class_name => "Person"
  belongs_to :caretaker, :class_name => "Person"
  belongs_to :subject, :class_name => "Person"
  belongs_to :survey
  belongs_to :response_set
  belongs_to :entry_set_response

  delegate :response_to_chart, :to => :response_set
  delegate :group_result, :to => :response_set
  delegate :access_code, :to => :response_set, :prefix => true
  delegate :full_name, :to => :subject, :prefix => true
  delegate :full_name, :to => :respondent, :prefix => true
  # delegate :entry_set_id, :to => :entry_set_response
  before_save :set_response_set, :if => :is_uncompleted_survey?
  after_save :send_respondent_invitation, :if => :invite_respondent_user

  scope :overdue, where("deadline < ? AND completed IS NULL", Time.zone.now)
  # scope :uncompleted, where("deadline >= ? AND completed IS NULL", Time.zone.now)
  scope :uncompleted, where("deadline >= ? AND completed IS NULL", DateTime.now.at_midnight)
  scope :recently_completed, where("completed IS NOT NULL")
  scope :completed, where("completed IS NOT NULL")
  scope :surveys, where("survey_id IS NOT NULL").joins(:survey).select("surveys.access_code, responder_items.*")
  scope :surveys_by_id, lambda {|survey_id| where("survey_id = ?", survey_id).joins(:survey).select("surveys.access_code, responder_items.*")}
  scope :registrations, where("registration_identifier IS NOT NULL").order(:id)
  scope :entry_request, where("entry_set_response_id IS NOT NULL")
  scope :surveys_by_group, ResponderItem.surveys.order('survey_id')
  scope :by_respondent, lambda {|respondent_id| where("respondent_id = ?", respondent_id)}
  scope :by_subject, lambda {|subject_id| where(:subject_id => subject_id)}
  scope :entry_set_responses, where("entry_set_response_id IS NOT NULL")
  scope :subject_ids, select(:subject_id).uniq

  accepts_nested_attributes_for :respondent, :subject, :entry_set_response

  attr_writer :current_user
  attr_accessor :invite_respondent_user, :subject_as_respondent

  
  attr_accessible :registration_identifier, :id, :caretaker_id, :deadline, :completed, 
                  :complete_item, :respondent_id, :subject_id, :survey_id, :invite_respondent_user, 
                  :days_until_deadline,:subject_attributes, :respondent_attributes, :entry_set_response_attributes,
                  :subject_as_respondent
  
  validates_associated :respondent, :subject

  ACTORS = %w{caretaker subject respondent}
  #DELETE: if not in use
  # ACTORS.each do |role|
  #   define_method("build_and_prepare_#{role}") do |*opt|
  #     arg = opt.first || {}
  #     person = Person.new(arg)
  #     person.current_responder_item= self
  #     send("#{role}=", person)
  #   end
  # end

  # ACTORS.each do |role|
  #   define_method("get_#{role}") do
  #     return  send("build_and_prepare_#{role}") if send("#{role}").nil?
  #     person = Person.find(send("#{role}_id"))
  #     person.current_responder_item= self
  #     person
  #   end
  # end

  def self.new_patient_item(params,caretaker)
    ResponderItem.new(params.merge({:caretaker_id => caretaker.id}))
  end

  def self.to_line_chart(params)
    ResponseSet.to_line_chart(params[:survey_id], params[:respondent_id])
  end

  def access_code
    self.survey.nil? ? self.registration_identifier : self.survey.access_code
  end

  def item_type
    if !self.survey.nil?
      'survey'
    elsif !self.entry_set_response.nil?
      'entry_set'
    elsif !self.registration_identifier.nil?
      'pre_registration'
    end
  end

  def is_survey?
    !self.survey.nil?
  end

  def is_entry_set_response?
    !self.entry_set_response.nil?
  end

  def complete_item=(is_complete)
   if is_complete.to_i == 1 && self.completed.nil?
    write_attribute :completed, Time.zone.now
   end
  end

  def result
    self.response_set.result_to_chart
  end

  private
  def is_uncompleted_survey?
    (!self.survey_id.nil? && self.completed.nil?)
  end

  def send_respondent_invitation
    KK.log respondent.nil?
    respondent.user_invite!(caretaker.user) if not respondent.nil? and not respondent.user_is_invited?
  end

  def set_response_set
    self.response_set=(ResponseSet.create(:survey_id => self.survey_id, :user_id => self.respondent.user.id))
  end
end
