FROM python:3.8-slim

RUN apt-get update -y && apt-get upgrade -y && apt-get install nodejs openjdk-17-jdk docker.io -y
RUN pip install cwlref-runner

CMD ["bash"]