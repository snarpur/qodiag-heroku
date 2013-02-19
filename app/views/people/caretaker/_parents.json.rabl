collection @person.parents
attributes :id, :firstname, :lastname, :full_cpr, :workplace, :workphone
node :address do |p|
  {
    :street_1 => p.address.street_1,
    :street_2 => p.address.street_2,
    :town => p.address.town,
    :zip_code => p.address.zip_code,
    :phone => p.address.phone,
    :home_phone => p.address.home_phone,
    :object_class => "address"
  }
end
node do
  {:formTemplate => "people/parentTmpl"}
end
node :schema do
  {
    :id => :Hidden,
    :firstname => :Text,
    :lastname => :Text,
    :full_cpr => :Text,
    :address => {
      :type => :NestedModel,
      :model => "App.Models.Base",
      :schema =>{
        :id => :Hidden,
        :street_1 => :Text,
        :street_2 => :Text,
        :town => :Text,
        :zip_code => :Text,
        :phone => :Text,
        :home_phone => :Text
      }
    },
    :workplace => :Text,
    :workphone => :Text
  }
end
