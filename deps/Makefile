CCFLAGS := -Wall
EMCC_FLAGS := -s MODULARIZE -s ALLOW_MEMORY_GROWTH
OBJ_DIR := ../src
TARGETS := utils.cpp

all: release

.PHONY: clean

debug: CCFLAGS += -DDEBUG -g
debug: build

release: CCFLAGS += -O3
release: build

test-browser: CCFLAGS += -DDEBUG -g
test-browser: OBJ_DIR = ./build
test-browser: build

build: $(TARGETS)
	mkdir -p $(OBJ_DIR) && emcc $(CCFLAGS) $(EMCC_FLAGS) \
		-o $(OBJ_DIR)/kissfft.js -I./kissfft $(TARGETS) \
		./kissfft/kiss_fft.c ./kissfft/kiss_fftnd.c \
		./kissfft/kiss_fftr.c ./kissfft/kiss_fftndr.c \
		-s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" \
		-s EXPORTED_FUNCTIONS="['_malloc', '_free', \
		'_kiss_fft_alloc', '_kiss_fft',\
		'_kiss_fftnd_alloc', '_kiss_fftnd', \
		'_kiss_fftr_alloc', '_kiss_fftr', '_kiss_fftri',\
		'_kiss_fftndr_alloc', '_kiss_fftndr', '_kiss_fftndri']"


clean:
	rm -r ../src/kissfft.js ../src/kissfft.wasm ./build/*
