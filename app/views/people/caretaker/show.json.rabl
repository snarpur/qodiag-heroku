object false
node do 
  {:subject => partial("people/caretaker/subject", :object => @person) }
end

node do 
  {:parents => partial("people/caretaker/parents", :object => @person.parents) }
end
