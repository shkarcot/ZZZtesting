from pymongo import MongoClient
from config_vars import DB_USERID_MONGO, DB_PASSWORD_MONGO, DB_HOST_MONGO, DB_PORT_MONGO, DB_AUTH_NM_MONGO
from builtins import staticmethod


SETTINGS_MONGO = {
            'username': DB_USERID_MONGO,
            'password': DB_PASSWORD_MONGO,
            'host': DB_HOST_MONGO + ":" + DB_PORT_MONGO,
            'database': DB_AUTH_NM_MONGO
        }

if DB_PASSWORD_MONGO != "" and DB_USERID_MONGO != "":
    MONGO_CLIENT = \
        MongoClient("mongodb://{username}:{password}@"
                    "{host}/?authSource={database}".format(**SETTINGS_MONGO))
else:
    MONGO_CLIENT = \
        MongoClient("mongodb://"
                    "{host}/?authSource={database}".format(**SETTINGS_MONGO))


class MongoDbConn:

    @staticmethod
    def get_server_info():
        return MONGO_CLIENT.server_info()

    @staticmethod
    def execute_operation(collection_name, query,
                          operation, where_clause=None, projection=None):
        assert operation in ["insert", "find", "find_one", "update",
                             "distinct", "remove", "count"]

        db = MONGO_CLIENT[SETTINGS_MONGO['database']]
        collection = db[collection_name]
        if operation == "update":
            return getattr(collection, operation)(where_clause,
                                                  {"$set": query},
                                                  upsert=True, multi=True)

        elif operation == "insert":
            return getattr(collection, operation)(query, check_keys=False)
        elif operation in ["find", "find_one"]:
            return getattr(collection, operation)(query, projection)
        elif operation == "distinct":
            return getattr(collection, operation)(projection, query)
        else:
            return getattr(collection, operation)(query)

    @staticmethod
    def find_one(collection_name, query, projection=None):
        return MongoDbConn.execute_operation(collection_name,
                                             query, operation="find_one", projection=projection)

    @staticmethod
    def find(collection_name, query, projection=None):
        return MongoDbConn.execute_operation(collection_name,
                                             query, operation="find", projection=projection)

    @staticmethod
    def remove(collection_name, query):
        return MongoDbConn.execute_operation(collection_name,
                                             query, operation="remove")

    @staticmethod
    def insert(collection_name, query):
        return MongoDbConn.execute_operation(collection_name,
                                             query, operation="insert")

    @staticmethod
    def update(collection_name, where_clause, query):
        return MongoDbConn.execute_operation(collection_name,
                                             query, operation="update",
                                             where_clause=where_clause)

    @staticmethod
    def distinct(collection_name, projection, query):
        return MongoDbConn.execute_operation(collection_name, query, operation="distinct",where_clause=None,
                                             projection=projection)

    @staticmethod
    def count(collection_name, query):
        return MongoDbConn.execute_operation(collection_name, query, operation="count")


