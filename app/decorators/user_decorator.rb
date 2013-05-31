class UserDecorator < Draper::Decorator
  delegate_all
  decorates :user
  decorates_association :person

  



end
