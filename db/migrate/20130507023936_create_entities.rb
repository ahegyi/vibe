class CreateEntities < ActiveRecord::Migration
  def change
    create_table :entities do |t|
      t.string :type # image, text, video etc.
      t.string :source # Instagram, Twitter, Foursquare, Flickr, etc.
      t.text :external_url # web/html viewable page on the source's website
      t.text :media_url # full size image URL (if type is image)
      t.text :caption # tweet text if type is text, otherwise caption/description
      t.integer :displayability_rank # rank from 1-N where N is the number of Entities for a given Query
      t.integer :interestingness # a logarithmic scale from 1 to 50 (1, 2, 10, 20, 50)
      t.integer :radius_rank # rank from 1-N where N is the number of Entities for a given Query
      t.integer :radius_distance # meters from lat/lng of Query location
      t.text :data # original JSON Entity data from an API

      t.integer :query_id

      t.timestamps
    end
  end
end
