class ResponderItem < ActiveRecord::Base
  belongs_to :person
  belongs_to :subject, :class_name => "Person"
  after_save :default_deadline

  private
  def default_deadline(date)
    if self.deadline.nil?
      self.deadline = created_at.advance(:weeks => 2)
    end
  end
end
