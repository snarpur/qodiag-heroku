module ActionView::Helpers::AssetTagHelper
  remove_const :JAVASCRIPT_DEFAULT_SOURCES
  JAVASCRIPT_DEFAULT_SOURCES = %w(jquery.js rails.js jquery-ui/development-bundle/ui/jquery-ui-1.8.2.custom.js jquery.metadata/jquery.metadata.js)

  reset_javascript_include_default
end