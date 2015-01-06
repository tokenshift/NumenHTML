require 'slim'
require 'uglifier'

IMAGES = FileList.new("*.png", "*.jpg")
SOURCES = ["zepto.min.js", "FileSaver.js", "sheet.js"]

desc "Generate minified CSS (using Compass)"
file "style.css" => IMAGES.add("style.scss") do
  if File.exist? "style.css"
    rm "style.css"
  end

  puts "compass compile"
  system("compass compile")
end

desc "Minify all JavaScript into a single file"
file "sheet.min.js" => SOURCES do
  puts "#{SOURCES} => sheet.min.js"

  source = ""
  SOURCES.each do |fname|
    source << File.read(fname) << "\n"
  end

  File.open("sheet.min.js", "w") do |f|
    f.write Uglifier.compile(source)
  end
end

desc "Aggregate all resources into a single HTML file"
file "sheet.html" => ["sheet.html.slim", "style.css", "sheet.min.js"] do
  puts "sheet.html.slim => sheet.html"
  template = Slim::Template.new("sheet.html.slim", pretty: true, indent: "\t")
  File.open("sheet.html", "w") do |f|
    f.write template.render
  end
end

task :default => "sheet.html"
