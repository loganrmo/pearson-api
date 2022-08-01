# Define ENV in docker-compose.yml

FROM debian:bullseye

RUN apt update && apt upgrade -y
RUN apt install python3 -y && apt install pip -y

RUN useradd -m -d /opt/app appuser

ADD . /opt/app
RUN chown -R appuser /opt/app

USER appuser
WORKDIR /opt/app
RUN pip install -r requirements.txt
# ENTRYPOINT [ "/bin/bash" ]
CMD ["python3", "main.py"]
