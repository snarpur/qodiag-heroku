collection @person.parents
attributes :id, :firstname, :lastname
node :address do |p|
  {:street_1 => p.address.street_1}
end
node do
  {:formTemplate => "people/parentTmpl"}
end
node :schema do
  {
    :id => :Hidden,
    :firstname => :Text,
    :lastname => :Text,
    :address => {
      :type => :NestedModel,
      :model => "App.Models.Base",
      :schema =>{
        :id => :Hidden,
        :street_1 => :Text
      }
    }
  }
end