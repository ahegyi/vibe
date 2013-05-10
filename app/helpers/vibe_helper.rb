require 'open-uri'
require 'uri'
require 'time'

module VibeHelper

# helper.foursquare_ll("34.048961,-118.238952")

  def foursquare_ll(ll)
    fs_interestingness = 5
    meters_in_km = 1000

    client = Foursquare2::Client.new(:client_id => ENV['FOURSQUARE_CLIENT_ID'], :client_secret => ENV['FOURSQUARE_CLIENT_SECRET'], :api_version => '20130505')
    venues  = client.trending_venues(ll, {:limit => 10, :radius => 5000}).venues
    fs_entities = []
    s_latlng = ll.split(',').map{|i| i.to_f}

    venues.each do |venue|
      id = venue['id']
      photo = client.venue_photos(id, {:limit => 1})["items"][0]
      photo_size = photo['width'].to_s + "x" + photo['height'].to_s
      v_latlng = [venue['location']['lat'], venue['location']['lng']]
      entity = Entity.new
      entity.type = "image"
      entity.source = "Foursquare"
      entity.external_url = venue['canonicalUrl']
      entity.media_url = photo['prefix'] + photo_size + photo['suffix']
      entity.caption = venue['name']
      entity.interestingness = fs_interestingness
      entity.radius_distance = (Geocoder::Calculations.distance_between(s_latlng, v_latlng) * meters_in_km)
      entity.data = [venue, photo]
      fs_entities << entity
    end

    return fs_entities
  end

  # lat, long is a geo pair of the search coordinates
  def instagram_ll(lat, long)
    meters_in_km = 1000

    entities = []

    # there are lots of issues with Instagram's media search, so let's try to catch them
    begin

      images = Instagram.media_search(
                lat.to_s,long.to_s,
                :distance => 5000, # largest radius possible
                :min_timestamp => (Time.now.tv_sec - 5*3600)) # max age = 5 hours ago

    rescue Instagram::BadRequest => e

      puts e.message
      return entities

    end

    if !images.empty?
      images.each do |image|
        entity = Entity.new

        # # TODO get followers_count, media_count, maybe we'll use this to influence interestingness
        # image_user = Instagram.user(image.user.id)
        # followers_count = image_user.counts.followed_by
        # media_count = image_user.counts.media

        entity.type = "image"
        entity.source = "Instagram"
        entity.external_url = image.link
        entity.media_url = image.images.standard_resolution.url

        # Build caption using the location name, if it exists,
        #   and then add the actual Instagram caption
        entity.caption = ""
        if image.location.is_a?(Hash) && !image.location.name.nil?
          entity.caption += image.location.name + ": "
        end
        if !image.caption.nil? && !image.caption.text.nil?
          entity.caption += image.caption.text
        end

        # need to do it this way or there are problems with the method 'count'
        likes_count = image.likes["count"]
        comments_count = image.comments["count"]
        # comments need a boost, since they are usually fewer in number
        activity = likes_count + comments_count * 10.0

        # graph this at desmos.com/calculator
        # will return a number from ~0 to less than 100, which is the asymptote
        entity.interestingness = (1 / Math.log(1/(0.0003*activity + 1.01))).to_i + 100

        entity.radius_distance = Geocoder::Calculations.distance_between([lat, long], [image.location.latitude, image.location.longitude]) * meters_in_km

        # # TODO set displayability_rank
        # entity.displayability_rank
        # # TODO need to create posted_at column!
        # entity.posted_at = Time.at(image.created_time.to_i).to_datetime

        # let's store the entire object in here too!
        entity.data = image
        entities << entity
      end
    end

    return entities
  end

  # lat, long is a geo pair of the search coordinates
  def twitter_ll(lat, long)
    twitter_search_uri = "http://search.twitter.com/search.json?"
    # default 5 kilometer radius
    twitter_search_geo_string = URI.escape(lat.to_s + "," + long.to_s + "," + "5km")
    # rpp => results per page
    # include_entities will include media objects
    # result_type 'mixed' includes recent and popular tweets
    # see https://dev.twitter.com/docs/api/1/get/search for full description
    twitter_search_options = "geocode=#{twitter_search_geo_string}&include_entities=true&result_type=mixed&rpp=100"

    entities = []
    meters_in_km = 1000

    begin
      result = open(twitter_search_uri + twitter_search_options)
    rescue e
      puts e.message
      return entities
    end

    result_hash = JSON.load(result.read)

    if result_hash.keys.include?("results") && result_hash["results"].length >= 1
      tweets = result_hash["results"]
      tweets.each do |tweet|
        # sometimes, this is nil even though we specify a geo fence. wtf
        next if tweet["geo"].nil?

        entity = Entity.new

        entity.source = "Twitter"
        entity.posted_at = Time.parse(tweet["created_at"])
        entity.username = tweet["from_user"]
        entity.real_name = tweet["from_user_name"]

        if tweet["entities"].keys.include?("media")
          entity.type = "image"
          entity.external_url = tweet["entities"]["media"].first["expanded_url"]
          entity.media_url = tweet["entities"]["media"].first["media_url"]
          # wild guess, for tweets with images
          entity.interestingness = 20
        else
          entity.type = "text"
          entity.external_url = "https://twitter.com/" + tweet["from_user"] + "/status/" + tweet["id_str"] + "/"
          # wild guess, for tweets that are just text
          entity.interestingness = 10
        end

        entity.caption = tweet["text"]

        if tweet["geo"].keys.include?("coordinates")
          entity.radius_distance = Geocoder::Calculations.distance_between([lat, long], tweet["geo"]["coordinates"]) * meters_in_km
        end

        entity.data = tweet
        entities << entity
      end
    end

    # don't return more than one tweet per user
    return entities.uniq{|tweet| tweet.username}
  end


  # Deprecated function, do not use! TODO remove this thing
  def get_point(input)
    geocode_base_uri = "http://geocoding.cloudmade.com/" + ENV["CLOUDMADE_API_KEY"] + "/geocoding/v2/find.js"

    results = open(geocode_base_uri + "?query=" + URI.escape(input))

    centroid = []

    results_hash = JSON.load(results.read)
    if !results_hash.nil? && !results_hash.empty? && results_hash.keys.include?("found")
      centroid = results_hash["features"][0]["centroid"]["coordinates"]
    end

    return centroid
  end

end
