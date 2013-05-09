Twitter.configure do |config|
  config.consumer_key = ENV['TWITTER_CLIENT_ID']
  config.consumer_secret = ENV['TWITTER_CLIENT_SECRET']
end