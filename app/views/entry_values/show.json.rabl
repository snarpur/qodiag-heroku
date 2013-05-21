object @entry_value
attributes :id
node do
  partial("entry_values/_entry_value", :object => @entry_value)
end