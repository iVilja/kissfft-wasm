EMCC := emcc
CFLAGS := -Wall -I./kissfft
EMCC_FLAGS := -s MODULARIZE -s ALLOW_MEMORY_GROWTH
OBJ_DIR := ../src
TARGETS := utils.o \
	./kissfft/kiss_fft.o ./kissfft/kiss_fftnd.o \
	./kissfft/kiss_fftr.o ./kissfft/kiss_fftndr.o

all: release

.PHONY: clean

debug: CFLAGS += -DDEBUG -g
debug: build

release: CFLAGS += -O3
release: build

test-browser: CFLAGS += -DDEBUG -g
test-browser: OBJ_DIR = ./build
test-browser: build

%.o : %.c
	$(EMCC) -c -o $@ $< $(CFLAGS)
build: $(TARGETS)
	mkdir -p $(OBJ_DIR) && $(EMCC) $(CFLAGS) $(EMCC_FLAGS) \
		-o $(OBJ_DIR)/kissfft.cjs $(TARGETS) \
		-s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" \
		-s EXPORTED_FUNCTIONS="['_malloc', '_free', \
		'_kiss_fft_alloc', '_kiss_fft',\
		'_kiss_fftnd_alloc', '_kiss_fftnd', \
		'_kiss_fftr_alloc', '_kiss_fftr', '_kiss_fftri',\
		'_kiss_fftndr_alloc', '_kiss_fftndr', '_kiss_fftndri']"


clean:
	rm -r ../src/kissfft.js ../src/kissfft.wasm ./build/*
