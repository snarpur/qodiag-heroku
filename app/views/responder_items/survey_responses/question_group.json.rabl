collection @responses
node do |i|
  {
    :answer => i.answer.weight,
    :question => i.question.display_order
  }
end
