# puts '############################'
# puts 'Launching Redis server....'
# puts '############################'
$redis = Redis.new(:host => 'localhost', :port=> 6379)
# location = ENV["REDISCLOUD_URL"] || 'redis://127.0.0.1:6379/0'
# uri = URI.parse(location)
# $redis = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)