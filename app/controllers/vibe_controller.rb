class VibeController < ApplicationController

  include VibeHelper

  def index
    @images = {}


    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @images }
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
    @place = "san francisco, ca"

    ll = Geocoder.coordinates(@place)
    @instagram_entities = instagram_ll(ll[0], ll[1])

    @instagram_entities.sort!{|e| e.interestingness}

    respond_to do |format|
      format.html # instagram_test.html.erb
      format.json { render json: @instagram_entities }
    end
  end

  def flickr_test

    @place = "Paris"

    coordinates = Geocoder.coordinates(@place)
   
    @flickr_arr = flickr_ll(coordinates[0], coordinates[1])

    respond_to do |format|
      format.html # matt.html.erb
      format.json { render json: @flickr_arr }
    end
  end
end
