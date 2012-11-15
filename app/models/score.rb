class Score < ActiveRecord::Base
  belongs_to :norm_reference
  scope :by_result_name, lambda {|n| where(:result_name => n)} #.group_by{|i|i[:result_name]}
  scope :by_name, lambda {|n| where(:name => n)}

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

  def is_range_value?
    !(self.start_value.nil? && self.end_value.nil?)
  end

  def self.by_result_names_in_groups(result_names, group_by=:result_name)
    self.by_result_name(result_names).group_by{|i|i.send(group_by)}
  end

  def self.by_names_in_groups(names, group_by=:name)
    self.by_name(names).group_by{|i|i.send(group_by)}
  end

  def self.by_names_and_result_names_in_groups(names,result_names)
    (self.by_name(names) & self.by_result_name(result_names)).group_by{|i|i.send(:result_name)}
  end
end
