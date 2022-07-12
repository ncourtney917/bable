import json
import requests
from flask import Flask, request, jsonify
import pymongo
from bson.json_util import dumps, loads

app = Flask(__name__)

@app.route('/add', methods=["GET"])
def create_record():
    name = request.args.get("name")
    gameId = request.args.get("gameId")
    #record = json.loads(request.data)
    record = {"gameId": gameId, "name": name}
    client = pymongo.MongoClient("mongodb+srv://babbleadmin:aBwJTJXWWncF1Kx5@gamelog.qaezs.mongodb.net/?retryWrites=true&w=majority")
    db = client.babblegames
    collection = db.gameentries
    print(record)
    collection.insert_one(record)
    #r = requests.post(base_url, data=data, headers=headers)
    response = jsonify({"name":name})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/read', methods=["GET"])
def read_record():
    gameId = request.args.get("gameId")
    client = pymongo.MongoClient("mongodb+srv://babbleadmin:aBwJTJXWWncF1Kx5@gamelog.qaezs.mongodb.net/?retryWrites=true&w=majority")
    db = client.babblegames
    collection = db.gameentries
    record = collection.find_one({"gameId":gameId})
    name = record["name"]
    response = jsonify({"name":name})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

app.run(debug=True)