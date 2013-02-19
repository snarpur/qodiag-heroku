object @person => :person
attributes :id, :firstname
node :schema do
  {
    :id => :Hidden,
    :firstname => :Text
  }
end