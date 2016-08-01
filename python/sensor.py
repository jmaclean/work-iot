import RPi.GPIO as GPIO
import time
import requests as req

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(11, GPIO.IN)

server_url = "http://localhost:3000"
bathroom_id = 1
reported_by = 'SENSOR'
largest_time_interval = 5 * 60 # in seconds

last_sent_time = 0
last_sent_status = -1

status_lookup = {0: 'OPEN', 1: 'CLOSED'}

while True:
    status = GPIO.input(11)
    if status != last_sent_status or time.time() - last_sent_time > largest_time_interval:
        req.post(server_url + '/data', {'status': status_lookup[status], 'bathroom_id': bathroom_id, 'reported_by': reported_by})
        last_sent_status = status
        last_sent_time = time.time()
    time.sleep(5)
