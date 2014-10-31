module ApplicationHelper

  def javascript(*args)
    args = args.map { |arg| arg == :defaults ? arg : arg.to_s }
    content_for(:head) { javascript_include_tag(*args) }
  end

  def resource_name
    :user
  end

  def resource
    @resource ||= User.new
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

  def i18n_assets(locale)
    if Rails.env == 'development'
      "/assets/i18n/#{locale}.js"
    else
      "/assets/#{locale}.js"
    end
  end
end
