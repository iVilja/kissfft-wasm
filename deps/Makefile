all:
	emcc -O3 -Wall -o ../src/kissfft.js -s MODULARIZE \
		kissfft/kiss_fft.c \
		-s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" \
		-s EXPORTED_FUNCTIONS="['_kiss_fft_alloc', '_kiss_fft', '_free']"
#	emcc -O3 -Wall ./fft.cpp ./kissfft/tools/kiss_fftr.c ./kissfft/tools/kiss_fftnd.c \
#		../kissfft/kiss_fftndr.c ../kissfft/kiss_fft.c -I ../kissfft \
#		-s EXPORTED_FUNCTIONS="['_rfft2d', '_irfft2d']"

clean:
	rm -r ./kissfft.js ./kissfft.wasm
