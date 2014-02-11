collection @responses
node do |i|
  {
    :id => i.id,
    :answer => i.answer.weight,
    :question => i.question.display_order.to_s.split(".")[0],
    :subquestion => i.question.display_order.to_s.split(".")[1].to_i,
    :text_value => i.text_value
  }
end
