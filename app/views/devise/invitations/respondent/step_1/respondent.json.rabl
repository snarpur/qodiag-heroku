node do |p|
  p.attributes
end
node do |p|
  {:user => partial("devise/invitations/respondent/step_1/user.json.rabl", :object => p.user)}
end