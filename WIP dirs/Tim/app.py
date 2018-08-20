from bson import Binary, Code, json_util
from bson.json_util import dumps
from flask import Flask, render_template, redirect, request, jsonify
from flask_marshmallow import Marshmallow
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy


import json
import numpy as np
import pandas as pd

# Old Mongo:
# import pymongo

# conn = 'mongodb://localhost:27017'
# client = pymongo.MongoClient(conn)

# db = client.real_estate_dc
# collection = db.data

app = Flask(__name__)
api = Api(app)
ma = Marshmallow(app)



app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/listings.sqlite"
db = SQLAlchemy(app)

class Listing(db.Model):
    __tablename__ = 'listings'

    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(64))
    url = db.Column(db.String(128))
    sale_type = db.Column(db.String(64))
    sold_date = db.Column(db.String(64))
    property_type = db.Column(db.String(64))
    city = db.Column(db.String(64))
    state = db.Column(db.String(64))
    zip_ = db.Column(db.Integer)
    price = db.Column(db.Integer)
    beds = db.Column(db.Integer)
    baths = db.Column(db.Integer)
    location = db.Column(db.String(64))
    sq_ft = db.Column(db.Integer)
    lot_size = db.Column(db.Integer)
    year_built = db.Column(db.Integer)
    days_on_market = db.Column(db.Integer)
    money_per_sq_ft = db.Column(db.Integer)
    hoa_per_month = db.Column(db.Integer)
    status = db.Column(db.String(64))
    next_open_house_start = db.Column(db.String(64))
    next_open_house_end = db.Column(db.String(64))
    source = db.Column(db.String(64))
    mls = db.Column(db.String(64))
    favorite = db.Column(db.String(64))
    interested = db.Column(db.String(64))
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)

    def serialize(self):
        
        return {
            "id": self.id,
            "address": self.address,
            "url": self.url,
            "sale_type": self.sale_type,
            "sold_date": self.sold_date,
            "property_type": self.property_type,
            "city": self.city,
            "state": self.state,
            "zip_": self.zip_,
            "price": self.price,
            "beds": self.beds,
            "baths": self.baths,
            "location": self.location,
            "sq_ft": self.sq_ft,
            "lot_size": self.lot_size,
            "year_built": self.year_built,
            "days_on_market": self.days_on_market,
            "money_per_sq_ft": self.money_per_sq_ft,
            "hoa_per_month": self.hoa_per_month,
            "status": self.status,
            "next_open_house_start": self.next_open_house_start,
            "next_open_house_end": self.next_open_house_end,
            "source": self.source,
            "mls": self.mls,
            "favorite": self.favorite,
            "interested": self.interested,
            "lat": self.lat,
            "lon": self.lon
            }


    def __repr__(self):
        return '<Listing %r>' % (self.address)


class listingSchema(ma.Schema):
    class Meta:
        fields = ("id","address","url","sale_type","sold_date","property_type",
        "city","state","zip_","price","beds","baths","location","sq_ft","lot_size",
        "year_built","days_on_market","money_per_sq_ft","hoa_per_month","status",
        "next_open_house_start","next_open_house_end","source","mls","favorite",
        "interested","lat","lon")

listing_schema = listingSchema()
listings_schema = listingSchema(many=True)


@app.before_first_request
def setup():
    # Recreate database each time for demo
    # db.drop_all()
    # db.create_all()
    pass

@app.route("/")
def home():
        
    return render_template("index.html")

@app.route("/data")
def data():

    db.drop_all()
    db.create_all()

    # Old Mongo:
    # collection.drop()

    real_estate_data = pd.read_csv("input_data/real_estate.csv")
    real_estate_data.fillna(value="N/A", inplace=True)
    real_estate_data = real_estate_data.rename(index=str, columns={"SALE TYPE": "sale_type",
                                                                    "SOLD DATE": "sold_date", 
                                                                    "URL (SEE http://www.redfin.com/buy-a-home/comparative-market-analysis FOR INFO ON PRICING)": "url",
                                                                    "PROPERTY TYPE": "property_type",
                                                                    "ADDRESS": "address",
                                                                    "CITY": "city",
                                                                    "STATE": "state",
                                                                    "ZIP": "zip_",
                                                                    "PRICE": "price",
                                                                    "BEDS": "beds",
                                                                    "BATHS": "baths",
                                                                    "LOCATION": "location",
                                                                    "SQUARE FEET": "sq_ft",
                                                                    "LOT SIZE": "lot_size",
                                                                    "YEAR BUILT": "year_built",
                                                                    "DAYS ON MARKET": "days_on_market",
                                                                    "$/SQUARE FEET": "money_per_sq_ft",
                                                                    "HOA/MONTH": "hoa_per_month",
                                                                    "STATUS": "status",
                                                                    "NEXT OPEN HOUSE START TIME": "next_open_house_start",
                                                                    "NEXT OPEN HOUSE END TIME": "next_open_house_end",
                                                                    "SOURCE": "source",
                                                                    "MLS#": "mls",
                                                                    "FAVORITE": "favorite",
                                                                    "INTERESTED": "interested",
                                                                    "LATITUDE": "lat",
                                                                    "LONGITUDE": "lon"})

    real_estate_data = real_estate_data.to_dict(orient="records")

    for doc in real_estate_data:
        row = Listing(**doc)
        db.session.add(row)

    db.session.commit()


    # Old Mongo:
    # collection.insert_many(real_estate_data)

    return redirect("..")

@app.route("/search", methods=["GET", "POST"])
def zoom():
    latitude = request.args.get("lat") 
    longitude = request.args.get("lon")
    ident = request.args.get("id")
    high_beds = request.args.get("high_beds")
    low_beds = request.args.get("low_beds")
    zip_ = request.args.get("zip_")
    location = request.args.get("location")
    state = request.args.get("state")
    property_type = request.args.get("property_type")
    city = request.args.get("city")
    high_price = request.args.get("high_price")
    low_price = request.args.get("low_price")
    high_baths = request.args.get("high_baths")
    low_baths = request.args.get("low_baths")
    high_sqft = request.args.get("high_sqft")
    low_sqft = request.args.get("low_sqft")
    high_lot_size = request.args.get("high_lot_size")
    low_lot_size = request.args.get("low_lot_size")
    high_year_built = request.args.get("high_year")
    low_year_built = request.args.get("low_year")
    high_money_per_sqft = request.args.get("high_moneySqft")
    low_money_per_sqft = request.args.get("low_moneySqft")
    high_hoa = request.args.get("high_hoa")
    low_hoa = request.args.get("low_hoa")
    status = request.args.get("status")


    query_result = db.session.query(Listing)

    if latitude and longitude:
        query_result = query_result.filter_by(lat=latitude).filter_by(lon=longitude)

    if ident:
        query_result = query_result.filter_by(id=ident)

    if high_beds:
        if high_beds != "0.00":
            query_result = query_result.filter(Listing.beds<=high_beds)

    if low_beds:
        query_result = query_result.filter(Listing.beds>=low_beds)

    if zip_:
        query_result = query_result.filter_by(zip_=zip_)

    if location:
        query_result = query_result.filter_by(location=location)

    if state:
        query_result = query_result.filter_by(state=state)

    if property_type:
        query_result = query_result.filter_by(property_type=property_type)

    if city:
        query_result = query_result.filter_by(city=city)

    if high_price:
        if high_price != "0.00":
            query_result = query_result.filter(Listing.price<=high_price)

    if low_price:
        query_result = query_result.filter(Listing.price>=low_price)

    if high_baths:
        if high_baths != "0.00":
            query_result = query_result.filter(Listing.baths<=high_baths)

    if low_baths:
        query_result = query_result.filter(Listing.baths>=low_baths)

    if high_sqft:
        if high_sqft != "0.00":
            query_result = query_result.filter(Listing.sq_ft<=high_sqft)

    if low_sqft:
        query_result = query_result.filter(Listing.sq_ft>=low_sqft)

    if high_lot_size:
        if high_lot_size != "0.00":
            query_result = query_result.filter(Listing.lot_size<=high_lot_size)

    if low_lot_size:
        query_result = query_result.filter(Listing.lot_size>=low_lot_size)

    if high_year_built:
        if high_year_built != "1900":
            query_result = query_result.filter(Listing.year_built<=high_year_built)

    if low_year_built:
        query_result = query_result.filter(Listing.year_built>=low_year_built)

    if high_money_per_sqft:
        if high_money_per_sqft != "0.00":
            query_result = query_result.filter(Listing.money_per_sq_ft<=high_money_per_sqft)

    if low_money_per_sqft:
        query_result = query_result.filter(Listing.money_per_sq_ft>=low_money_per_sqft)

    if high_hoa:
        if high_hoa != "0.00":
            query_result = query_result.filter(Listing.hoa_per_month<=high_hoa)

    if low_hoa:
        query_result = query_result.filter(Listing.hoa_per_month>=low_hoa)

    if status:
        query_result = query_result.filter_by(status=status)

    query_result = query_result.all()


    result = listings_schema.dump(query_result)
    return jsonify(result.data)




class dataset(Resource):
    def get(self):

        query_result = db.session.query(Listing).all()
        result = listings_schema.dump(query_result)
        return jsonify(result.data)



        # Old Mongo:
        # items = list(collection.find())
        # return json.loads(dumps(items))


api.add_resource(dataset, '/resource')


if __name__ == '__main__':
    app.run()
