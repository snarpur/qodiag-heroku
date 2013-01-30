APP_CONFIG ||= {}
APP_CONFIG[:backbone_forms] ||= {}
module ApplicationForms
  FORM_PATH = "#{Rails.root}/lib/backbone_forms/"

  def ApplicationForms.setup
    if Rails.env.production?
      ApplicationForms.load_forms
    end
  end 

  def ApplicationForms.get(name)
    if Rails.env.development? || Rails.env.tes?
      ApplicationForms.set_form_config("#{name}.yml")
    end
    APP_CONFIG[:backbone_forms][name.to_sym]
  end
  
  def ApplicationForms.load_forms
    Dir.foreach(FORM_PATH) do |item|
      next if item == '.' or item == '..'
        ApplicationForms.set_form_config(item)
    end
  end

  def ApplicationForms.set_form_config(name)
    f = File.open("#{ApplicationForms::FORM_PATH}#{name}", "r")
    h = HashWithIndifferentAccess.new(YAML.load(f))
    APP_CONFIG[:backbone_forms][name.gsub(/\.yml/,'').to_sym] = h
    f.close
  end
end
ApplicationForms.setup()