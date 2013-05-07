class CreateQueries < ActiveRecord::Migration
  def change
    create_table :queries do |t|
      t.string :input
      t.string :named_place
      t.integer :radius # in meters

      t.decimal :lat, null: false, precision: 16, scale: 14
      t.decimal :lng, null: false, precision: 17, scale: 14

      t.timestamps
    end
  end
end
