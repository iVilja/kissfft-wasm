CFLAGS := -Wall

debug: CCFLAGS += -DDEBUG -g
debug: build

release: CCFLAGS += -O3
release: build

build: ./api.cpp
	emcc $(CCFLAGS) -o ../src/kissfft.js -s MODULARIZE \
		./api.cpp \
		kissfft/kiss_fft.c \
		-s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" \
		-s EXPORTED_FUNCTIONS="['_kiss_fft_alloc', '_kiss_fft']"
#	emcc -O3 -Wall ./fft.cpp ./kissfft/tools/kiss_fftr.c ./kissfft/tools/kiss_fftnd.c \
#		../kissfft/kiss_fftndr.c ../kissfft/kiss_fft.c -I ../kissfft \
#		-s EXPORTED_FUNCTIONS="['_rfft2d', '_irfft2d']"

clean:
	rm -r ../src/kissfft.js ../src/kissfft.wasm
