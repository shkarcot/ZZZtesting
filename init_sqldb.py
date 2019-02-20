import os, django

os.environ['DJANGO_SETTINGS_MODULE'] = 'console.settings'
django.setup()

# import MySQLdb
# from config_vars import MYSQL_DATABASE, MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_HOSTNAME


# def create_sqldb():
#     print("Creating Sql database")
#     db = MySQLdb.connect(MYSQL_HOSTNAME, MYSQL_USERNAME, MYSQL_PASSWORD)
#     cursor = db.cursor()
#     try:
#         cursor.execute('CREATE DATABASE IF NOT EXISTS ' + MYSQL_DATABASE)
#     except Exception as e:
#         print(str(e))
#         pass
#
#
# if __name__ == '__main__':
#     create_sqldb()

import sqlite3
from sqlite3 import Error


def create_connection():
    """ create a database connection to a database that resides
        in the memory
    """
    try:
        conn = sqlite3.connect(':memory:')
    except Error as e:
        print(str(e))
    finally:
        conn.close()


if __name__ == '__main__':
    create_connection()
