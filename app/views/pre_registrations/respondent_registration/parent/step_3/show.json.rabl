object @responder_item
attributes :id
node(:complete_item){"1"}

child :subject => :subject do
  attributes :id

  node :inverse_relations do
    [
      partial("#{@responder_item.pre_registration_template}/step_#{@step_no}/parent_guardian", :object => @responder_item.subject.opposite_parent_relation)
    ]
  end
end