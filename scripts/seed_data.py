from connections.mongodb import MongoDbConn
import json, os
from config_vars import SCRIPTS_ROOT


def seed_data(file_name, collection_name):
    try:
        MongoDbConn.remove(collection_name, {})
        data = json.loads(open(os.path.join(SCRIPTS_ROOT, file_name)).read())
        for itm in data:
            MongoDbConn.insert(collection_name, itm)
    except Exception as e:
        print(str(e))

