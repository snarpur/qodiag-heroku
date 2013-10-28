# Put this somewhere it will get auto-loaded, like config/initializers
module DeviseFilters
  def self.add_filters
    
    # Example of adding one selective before_filter.
    Devise::SessionsController.before_filter :unauthorized_raise_401, :except => ['new','create','destroy']
  end

  self.add_filters
end
