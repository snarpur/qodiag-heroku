object false
node do 
  {:subject => partial("people/caretaker/subject", :object => @person) }
end

node do 
  {:parents => partial("people/caretaker/parents", :object => @person.parents) }
end

node :form_schema do
  {
    :subject =>{
      :id => :Hidden,
      :firstname => :Text
    },
    :parents =>{
      :id => :Hidden,
      :firstname => :Text
    }
  }
end