#python3 init_sqldb.py
#python3 manage.py makemigrations
python3 manage.py migrate
python3 init_users.py
python3 manage.py collectstatic --noinput
/usr/bin/supervisord
