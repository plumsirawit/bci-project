import socket
import firebase_admin
from firebase_admin import credentials
s = socket.socket()
s.connect(('127.0.0.1', 5204))
while True:
	data = s.recv(1024).decode('utf-8')
	if len(data) == 0:
		break
	print('Received', data)
