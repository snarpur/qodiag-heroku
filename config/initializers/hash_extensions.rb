class Hash
  def symbolize_all_keys!
    symbolize_keys!
    values.each{|h| h.symbolize_all_keys! if h.is_a?(Hash) }
    values.select{|v| v.is_a?(Array) }.flatten.each{|h| h.symbolize_all_keys! if h.is_a?(Hash) }
    self
  end
end