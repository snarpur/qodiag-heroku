namespace :glyphs do
  task :compile do
    puts "Remove existing glyph file from app/assets/stylesheets/partials/_fontcustom.css.scss}"
    %x{rm app/assets/stylesheets/partials/_fontcustom.css.scss}

    puts "Comiling glyphs lib/font-glyphs/*.SVG"
    %x(fontcustom compile lib/font-glyphs/)

    puts "Copying new fonts to app/assets/fonts"
    %x(cp -f lib/font-glyphs/fonts/fontcustom.* app/assets/fonts/fontcustom)

    puts "Copying SCSS glyph declarations file to app/assets/stylesheets/partials/_fontcustom.css.scss"
    %x{cp -f lib/font-glyphs/fonts/_fontcustom.scss app/assets/stylesheets/partials/_fontcustom.css.scss}

    puts "Removing @font-face lines from app/assets/stylesheets/partials/_fontcustom.css.scss"
    %x{sed -i.bak '5,14d' app/assets/stylesheets/partials/_fontcustom.css.scss}
    %x{rm app/assets/stylesheets/partials/_fontcustom.css.scss.bak}
  end


  task :test do
    puts "fontcustom compile lib/font-glyphs/"
    %x(fontcustom compile lib/font-glyphs/)
  end
end