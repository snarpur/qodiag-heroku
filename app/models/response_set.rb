module ResponseSetCustomMethods

  def self.included(base)
    base.send :attr_accessor, :status
    base.send :after_save, :complete_responder_item
  end

  def respondent
    self.responder_item.respondent
  end

  def subject
    self.responder_item.subject
  end

  def group_names
    names = self.responses.joins(:question => :question_group) & QuestionGroup.names
    names.collect{|e| e.text}
  end

  def sum_of_group_result(group_name)
    self.responses.joins(:answer,:question => :question_group).
      where(:question_groups => {:text => group_name}).
      sum('answers.weight').to_i
  end

  def group_result(group_name)
    self.responses.joins(:answer,:question => :question_group).
      where(:question_groups => {:text => group_name})
  end

  def weights_by_groups(group_name)
    result =  self.responses.joins(:answer,:question => :question_group).
              where(:question_groups => {:text => group_name}).
              select('answers.weight')
              
  end

  def norm_reference(id=nil)
    return @norm_reference if @norm_reference
    unless id.nil?
      @norm_reference = NormReference.find(id)
    else
      @norm_reference = NormReference.find_match({:survey_id => self.survey.id, :sex => self.subject.sex, :age => self.subject.age})
      if @norm_reference == nil
        @norm_reference = NormReference.get_norm_reference_for_oldest(self.survey.id, self.subject.sex)
      end
    end
    @norm_reference
  end

  def norm_reference_group_name
    norm_reference.norm_reference_group_name
  end
  
  def norm_reference_by_age_options(respondent)
    NormReference.where({:survey_id => self.survey.id, :sex => self.subject.sex, :responder => respondent.to_s}).select('id, age_start, age_end')
  end

  def survey_name
    self.survey.access_code
  end
  
  def results_with_total_for_current_groups(groups)
    total = groups.select{|g| g == "total"}
    data = (groups - total).map{|g| self.sum_of_group_result(g)}
    data << data.sum unless total.empty?
    data
  end

  private
  def complete_responder_item
    unless self.completed_at.nil?
      self.responder_item.update_attribute(:completed,self.completed_at)
    end
  end

  def validate_mandatory_questions
    errors.add(:base, "can't be in the past") unless
        self.mandatory_questions_complete?
  end
end

class ResponseSet < ActiveRecord::Base
  include Surveyor::Models::ResponseSetMethods
  include ResponseSetCustomMethods
  include ResponseSetChartRenderer::InstanceMethods
  extend ResponseSetChartRenderer::ClassMethods
  has_one :responder_item

  scope :by_survey, lambda{|survey_id| where("response_sets.survey_id = ?", survey_id)}
  scope :by_respondent, lambda{|respondent_id| joins(:responder_item).where("responder_items.respondent_id = ?", respondent_id)}
  scope :by_subject, lambda{|subject_id|joins(:responder_item).where("responder_items.subject_id = ?", subject_id)}
  scope :completed, where("completed_at IS NOT NULL")
  

  def self.to_line_chart(survey_id, respondent_id)
    responses = ResponseSet.completed.by_survey(survey_id).by_respondent(respondent_id)
    ResponseSet.responses_to_chart(responses)
  end
  %w{chart_methods response_set_chart_renderer}.each {|c| require_dependency "#{c}.rb"} if Rails.env.development?

end