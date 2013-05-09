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

  def flickr_test

    @place = "Austin, Tx"

    coordinates = Geocoder.coordinates(@place)
    # binding.pry
    @flickr_arr = flickr_ll(coordinates[0], coordinates[1])

    respond_to do |format|
      format.html # matt.html.erb
      format.json { render json: @flickr_arr }
    end

  end

end
