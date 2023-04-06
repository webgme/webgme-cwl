FROM python:3.9.15-slim-buster
WORKDIR /app
COPY . .
RUN pip3 install -r requirements.txt
COPY main.py .
CMD ["python", "main.py"]

