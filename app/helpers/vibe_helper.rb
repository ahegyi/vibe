require 'open-uri'
require 'uri'
require 'time'
require 'flickraw'

module VibeHelper

  # lat and long arguments should be floats
  def foursquare_ll(lat, long)
    fs_interestingness = 20..80

    ll = [lat, long].join(",")
    client = Foursquare2::Client.new(:client_id => ENV['FOURSQUARE_CLIENT_ID'], :client_secret => ENV['FOURSQUARE_CLIENT_SECRET'], :api_version => '20130505')
    venues  = client.trending_venues(ll, {:limit => 10, :radius => 5000}).venues
    fs_entities = []
    source_latlng = [lat, long]

    venues.each do |venue|
      id = venue['id']

      # get two most recent photos (group => venue returns public photos by recentness)
      photos = client.venue_photos(id, {:limit => 2, :group => "venue"})["items"]

      photos.each do |photo|

        next if photo.nil? || photo.empty?

        photo_size = photo['width'].to_s + "x" + photo['height'].to_s
        venue_latlng = [venue['location']['lat'], venue['location']['lng']]
        entity = Entity.new
        entity.type = "image"
        entity.source = "Foursquare"
        entity.posted_at = Time.at(photo['createdAt'].to_i)
        entity.username = ""

        first_name = photo['user']['firstName'].nil? ? "" : photo['user']['firstName']
        last_name = photo['user']['lastName'].nil? ? "" : photo['user']['lastName']
        if first_name.empty? && last_name.empty?
          entity.real_name = ""
        else
          entity.real_name = (first_name + " " + last_name).strip
        end

        entity.external_url = venue['canonicalUrl']
        entity.media_url = photo['prefix'] + photo_size + photo['suffix']
        entity.caption = venue['name']
        entity.interestingness = rand(fs_interestingness)
        entity.radius_distance = (Geocoder::Calculations.distance_between(source_latlng, venue_latlng) * 1000)
        entity.data = { "venue" => venue, "photo" => photo}

        fs_entities << entity
      end

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

        entity.posted_at = Time.at(image.created_time.to_i)
        entity.username = image.user.username
        entity.real_name = image.user.full_name

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

        # let's store the entire object in here too!
        entity.data = image
        entities << entity
      end
    end

    return entities
  end

  # lat, long is a geo pair of the search coordinates
  def twitter_ll(lat, long)
    twitter_search_uri = "http://search.twitter.com/search.json"
    # default 5 kilometer radius
    twitter_search_geo_string = URI.escape(lat.to_s + "," + long.to_s + "," + "5km")
    # rpp => results per page
    # include_entities will include media objects
    # result_type 'mixed' includes recent and popular tweets
    # see https://dev.twitter.com/docs/api/1/get/search for full description
    twitter_search_options = "?geocode=#{twitter_search_geo_string}&include_entities=true&result_type=mixed&rpp=100"

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

      new_max_id = tweets.map{|t| t['id']}.min - 1

      tweets.select! do |tweet|
        tweet["entities"].keys.include?("media") && !tweet['geo'].nil? && tweet['geo']['coordinates'] != [0,0]
      end

      max_attempts = 10
      request_count = 0

      # 'page' through results, keep going until we get
      # 10 properly geocoded photo tweets OR we've
      # reached max_attempts
      while tweets.count < 10 && request_count < max_attempts
        new_tweets = []
        request_count += 1
        result = open(twitter_search_uri + twitter_search_options + "&max_id=" + new_max_id.to_s)
        result_hash = JSON.load(result.read)
        if result_hash.keys.include?("results") && result_hash["results"].length >= 1
          new_tweets = result_hash["results"]

          new_max_id = new_tweets.map{|t| t['id']}.min - 1

          new_tweets.select! do |tweet|
            tweet["entities"].keys.include?("media") && !tweet['geo'].nil? && tweet['geo']['coordinates'] != [0,0]
          end
        end
        tweets += new_tweets
      end

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
          entity.interestingness = rand(20..50)
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

  #lat, long should be floats
  def flickr_ll(lat, long)
    meters_in_km = 1000
    fk_entities = []
    source_latlng = [lat, long]

    radius = "32"
    radius_units = "km"
    accuracy = 3 # Current range is 1-16 : World level is 1, Country is ~3, Region is ~6, City is ~11, Street is ~16
    days_prior = 5
    min_taken_date = Time.now.to_i - (days_prior * 8640)
    per_page = 10

    fk_photos = flickr.photos.search(:lat => lat.to_s, :lon => long.to_s, :radius => radius.to_s,
                                      :radius_units => radius_units, :accuracy => accuracy.to_s,
                                      :media => "photos", :sort => "interestingness-desc",
                                      :min_taken_date => min_taken_date.to_s, :max_taken_date => Time.now.to_i,
                                      :per_page => per_page.to_s, :extras => "description, date_upload, date_taken,
                                      owner_name, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_z")

    if fk_photos.size > 0
      interestingness_counter = 80
      interestingness_step = interestingness_counter/fk_photos.size
    end

    fk_photos.each do |photo|
      photo_latlng = [photo["latitude"], photo["longitude"]]
      entity = Entity.new
      entity.type = "image"
      entity.source = "Flickr"
      entity.external_url = "http://www.flickr.com/photos/" +
                            photo["owner"] + "/" + photo["id"]

      entity.media_url = photo["url_z"]

      # Build the caption like so:
      # "Title" if description is blank
      # "Description" if title is blank
      # "Title - Description" if neither are blank
      if !photo["title"].nil? && !photo["title"].empty?
        entity.caption = photo["title"].strip
      else
        entity.caption = ""
      end
      if !photo["description"].nil? && !photo["description"].empty?
        if entity.caption == ""
          entity.caption += photo["description"]
        else
          entity.caption += " - " + photo["description"]
        end
      end

      entity.interestingness = interestingness_counter
      interestingness_counter -= interestingness_step
      entity.radius_distance = (Geocoder::Calculations.distance_between(source_latlng, photo_latlng) * 1000)

      entity.username = photo["pathalias"]
      entity.real_name = photo["ownername"]
      entity.posted_at = Time.parse(photo["datetaken"])

      entity.data = photo

      fk_entities << entity
    end

    return fk_entities
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
