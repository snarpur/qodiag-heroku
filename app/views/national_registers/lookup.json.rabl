object @person
attributes :firstname => :firstname, :lastname => :lastname, :kyn => :sex
node :address, :if =>  !@person.nil? do |p|
  attributes :street_1 => p.heimili, :zip_code => p.postnumer, :town => p.town
end
