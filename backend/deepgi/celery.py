import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'deepgi.settings')

app = Celery('deepgi', broker=os.environ.get(
    'REDIS_URL', 'redis://broker:6379'))

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
