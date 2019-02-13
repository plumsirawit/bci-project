from pylsl import StreamInlet, resolve_stream
import time
from math import pi, sin, cos
from sklearn.cross_decomposition import CCA
import numpy as np
import socket

S = 250
N = 20 # Number of harmonics
X = [[[0.0 for j in range(6)] for i in range(S)] for fp in range(4)]
Y = [[[0.0 for j in range(N)] for i in range(S)] for fp in range(4)]
# Use Sliding Window
def getCoeff(id,sample,framePeriod,currentTimeMillis):
	T = framePeriod[0]/60
	tau = framePeriod[1]/60
	t = currentTimeMillis/1000
	x = list(map(lambda x: x - tau/T,sample.copy()))
	y = []
	for n in range(1,N+1):
		y.append((2/(n*pi)) * sin(pi*n*tau/T) * cos(2*pi*n*(t - tau/2)/T))
	del X[id][0]
	del Y[id][0]
	X[id].append(x.copy())
	Y[id].append(y.copy())
	cca = CCA(n_components=1)
	X_c, Y_c = cca.fit_transform(X[id],Y[id])
	result = np.corrcoef(X_c.T, Y_c.T)[0,1]
	return result
print('looking for an EEG stream...')
streams = resolve_stream('type','EEG')
inlet = StreamInlet(streams[0])
fprs = [(4,2),(5,3),(6,3),(7,4)]
i = 0
print('EEG stream found')
s = socket.socket()
s.bind(('',5204))
s.listen(5)

c, addr = s.accept()
print('Got connection from',addr)
while True:	
	i += 1
	sample, timestamp = inlet.pull_sample()
	sample = sample[:-2]
	ctimemillis = int(round(time.time() * 1000))
	result = list(map(lambda fpr: getCoeff(fpr[0],sample,fpr[1],ctimemillis),enumerate(fprs)))
	print('[DEBUG]',i,list(map(lambda x: '%.4f' % x, result)))
	if max(result) - min(result) > 0.2 and i > S:
		c.send(str.encode(str(np.argmax(result)+1)))
		print('------> [RESULT]',np.argmax(result)+1,list(map(lambda x: '%.4f' % x, result)))
		i = 0
c.close()
