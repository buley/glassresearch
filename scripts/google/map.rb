#!/usr/bin/ruby
#!/usr/bin/gem
 
require 'rubygems'
require 'crack'
 
ARGF.each do |line|
  activity = line.strip
  unless activity.length == 0
    begin
      parsed = Crack::JSON.parse(activity)
      if parsed['text'].downcase.include?('ifihadglass')
        puts 'mention'
      end
    rescue
      # couldn't parse activity
    end
  end    
end
