from flask import *
import logging
from utill import *
import json
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import create_engine


JSON_FORMAT = 'application/json'
ERROR_MESSAGE_PATH = './backend/error_message.json'
LOG_PATH = './backend/logs/log.txt'
DATABASE_URI = "postgresql://postgres:123456@localhost/PeterPark"
app = Flask(__name__)
app.config["DEBUG"] = True
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
logging.basicConfig(filename = LOG_PATH,level=logging.DEBUG)

# route
@app.route("/plate",methods = ['GET', 'POST'])
def plateAction():
    if request.method == 'GET':
        dbObject = DB()
        plates = DB.get_plates()
        plates = list(map(lambda x: 
        {
        "id": x.Id,
        "plate" : x.Plate,
        "owner" : x.Owner,
        "start_date": x.Start_Date.isoformat()+"Z" if x.Start_Date != None else None,
        "end_date": x.End_Date.isoformat()+"Z" if x.End_Date != None else None
        },plates))
        app.logger.info("get plate")
        return jsonify(plates)
    if request.method == 'POST':

        #load errors
        error = json.load(open(ERROR_MESSAGE_PATH))

        #load data
        data = request.get_json()
        plate,owner,start_date,end_date = data.get("plate") , data.get("owner") , data.get("start_date") , data.get("end_date")

        #data validation
        if isEmpty(plate):
            return Response(error["noplate"]["message"],status=error["noplate"]["code"],mimetype=JSON_FORMAT)
        elif not isValidPlate(plate):
            return Response(error["invalidplate"]["message"],status=error["invalidplate"]["code"],mimetype=JSON_FORMAT)
        elif not isEmpty(start_date) and not isValidDate(start_date):
            return Response(error["invalidstart_date"]["message"],status=error["invalidstart_date"]["code"],mimetype=JSON_FORMAT)
        elif not isEmpty(end_date) and not isValidDate(end_date):
            return Response(error["invalidend_date"]["message"],status=error["invalidend_date"]["code"],mimetype=JSON_FORMAT)

        dbObject = DB()
        dbObject.add_plate(plate,owner,start_date,end_date)
        app.logger.info("one plate has been added")
        return Response("",200,mimetype=JSON_FORMAT)   
    else:
        return Response("method not allowd!",status=405,mimetype='application/json')

#db
db = SQLAlchemy(app)
class Plate(db.Model):
    __tablename__ = 'Plates'
    Id = db.Column(db.Integer,primary_key=True, nullable=False)
    Plate = db.Column(db.String(10), nullable=False)
    Owner = db.Column(db.String(128), nullable=True)
    Start_Date = db.Column(db.DateTime, nullable=True)
    End_Date = db.Column(db.DateTime, nullable=True)
class DB:
    def __init__(self):
        self.create_table_plate()
        pass
    def create_table_plate(self):
        engine = create_engine(DATABASE_URI)
        db.metadata.create_all(engine,checkfirst=True)
    def add_plate(self,plate,owner,start_date,end_date):
        row = Plate(Plate = plate,Owner = owner,
                    Start_Date = start_date,End_Date = end_date)
        db.session.add(row)
        db.session.commit()
    def get_plates():
        users = Plate.query.all()
        return users

if __name__ == "__main__":
    app.run(debug=True)
