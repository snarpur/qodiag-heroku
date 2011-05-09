class ResponderItem < ActiveRecord::Base
  belongs_to :client, :class_name => "Person"
  belongs_to :caretaker, :class_name => "Person"
  belongs_to :subject, :class_name => "Person"
  #after_save :set_subject


  def complete_item=(complete_item)
   self.completed = Time.zone.now
  end

  def complete_item
  end

  private
  def set_subject
    if self.subject.nil?
      KK.see self.client
    end
  end




end
