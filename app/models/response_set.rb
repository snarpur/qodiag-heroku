module ResponseSetCustomMethods

  def self.included(base)
    base.send :attr_accessor, :status
    base.send :after_save, :complete_responder_item
    #base.send :validate, :validate_mandatory_questions, :on => :update, :unless => Proc.new{|r|r.status.nil?}
  end


  def responder_item
    ResponderItem.where(:response_set_id => self.id).first
  end

  def responder
    self.responder_item.client
  end

  def subject
    self.responder_item.subject
  end

  def group_names
    names = self.responses.joins(:question => :question_group) & QuestionGroup.names
    names.collect{|e| e.text}
  end

  def group_result(group_name)
    result =  self.responses.joins(:answer,:question => :question_group).
              where(:question_groups => {:text => "#{group_name}"}).
              sum('answers.weight').to_i
    result
  end

  def group_norm_reference(group,value)
    self.norm_reference.get_score(group,value)
  end

  def norm_reference
    NormReference.age(self.subject.age).sex(self.subject.sex).survey(self.survey.id).first
  end

  def result_to_chart
    ChartRenderer.new(self).result_to_chart
  end

  private
  def complete_responder_item
    unless self.completed_at.nil?
      self.responder_item.update_attribute(:completed,self.completed_at)
    end
  end

  def validate_mandatory_questions
    KK.see "validating #{self.inspect}"
    errors.add(:base, "can't be in the past") unless
        self.mandatory_questions_complete?
  end
end

class ResponseSet < ActiveRecord::Base
  include Surveyor::Models::ResponseSetMethods
  #load "app/chart_renderer.rb"
  include ResponseSetCustomMethods
  #include ChartRenderer
end
