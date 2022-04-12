web: gunicorn ecommerce.wsgi --log-file -
heroku ps:scale web=1
python3 manage.py collectstatic
python3 manage.py migrate