FROM nvcr.io/nvidia/tensorrt:24.10-py3


RUN pip install --upgrade pip

RUN apt update -y
RUN apt upgrade -y
RUN apt install ffmpeg libsm6 libxext6  -y
RUN apt-get update && apt-get install -y ffmpeg && apt-get install -y libgl1

WORKDIR /app

COPY requirements.txt .
RUN apt install -y python3-dev default-libmysqlclient-dev build-essential 
RUN pip install -r requirements.txt --default-timeout=100
RUN pip install uvicorn gunicorn
RUN pip install whitenoise
# RUN pip install onnxruntime-gpu==1.17.1 --extra-index-url https://aiinfra.pkgs.visualstudio.com/PublicPackages/_packaging/onnxruntime-cuda-12/pypi/simple/
RUN apt install libmediainfo-dev -y
COPY . .


CMD python3.10 manage.py migrate && python3.10 manage.py runserver 0.0.0.0:5000
