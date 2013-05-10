class VibeController < ApplicationController

  include VibeHelper

  def index
    @images = {}


    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @images }
    end
  end

  def entities_for_query
    query = Query.new
    @entities = []

    start_time = Time.now

    query.input = params[:query]
    query.geocode

    if !query.lat.nil? && !query.lng.nil?
      @entities += foursquare_ll(query.lat, query.lng)
      @entities += twitter_ll(query.lat, query.lng)
      @entities += instagram_ll(query.lat, query.lng)
    end

    # sort by interestingness descending
    @entities.sort! { |a,b| a.interestingness <=> b.interestingness }.reverse!

    puts "Took #{Time.now - start_time} seconds"

    respond_to do |format|
      format.json { render json: @entities }
    end

  end

  # returns a json object with the query and the lat/long as an array 'coordinates'
  def geocode
    query = params[:query]
    coordinates = Geocoder.coordinates(query)
    @place = { "query" => query, "coordinates" => coordinates }
    respond_to do |format|
      format.json { render json: @place }
    end
  end


  def foursquare

    @place = "Washington D.C."

    coordinates = Geocoder.coordinates(@place)

    @foursquare_arr = foursquare_ll(coordinates[0], coordinates[1])

    respond_to do |format|
      format.html # matt.html.erb
      format.json { render json: @foursquare_arr }
    end
  end


  def instagram_test
    @place = "San Francisco, CA"

    ll = Geocoder.coordinates(@place)
    @instagram_entities = instagram_ll(ll[0], ll[1])

    @instagram_entities.sort!{|e| e.interestingness}

    respond_to do |format|
      format.html # instagram_test.html.erb
      format.json { render json: @instagram_entities }
    end
  end

  def flickr_test

    @place = "San Francisco, CA"

    coordinates = Geocoder.coordinates(@place)

    @flickr_arr = flickr_ll(coordinates[0], coordinates[1])

    respond_to do |format|
      format.html # matt.html.erb
      format.json { render json: @flickr_arr }
    end
  end
end
