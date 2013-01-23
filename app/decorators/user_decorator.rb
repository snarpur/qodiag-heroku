class UserDecorator < Draper::Decorator
  delegate_all
  decorates :user

end
