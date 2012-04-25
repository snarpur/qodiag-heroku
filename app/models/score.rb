class Score < ActiveRecord::Base
  belongs_to :norm_reference
  scope :result_name, lambda {|n| where(:result_name => n)}
  scope :score_name, lambda {|n| where(:name => n)}

  def self.get_score(score, result)
    score_name(score).result_name(result)
  end

  def get_value
    self.value.nil? ? get_range_span : self.value
  end

  def get_range_span
    start = self.start_value.zero? ? self.start_value : self.start_value - 1
    (start - self.end_value).abs
  end

  def get_range_values
    [self.start_value, self.end_value]
  end
end
