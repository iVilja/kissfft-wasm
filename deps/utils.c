#include <stdlib.h>
#include <string.h>

#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
float *allocate(size_t n) {
    return (float *) calloc(n, sizeof(float));
}

EMSCRIPTEN_KEEPALIVE
float *copy(const float *arr, size_t n) {
    float *ret = allocate(n);
    memcpy(ret, arr, n * sizeof(float));
    return ret;
}

EMSCRIPTEN_KEEPALIVE
float get_value(const float *arr, size_t i) {
    return arr[i];
}

EMSCRIPTEN_KEEPALIVE
void set_value(float *arr, size_t i, float value) {
    arr[i] = value;
}

EMSCRIPTEN_KEEPALIVE
void scale(float *arr, size_t n, float factor) {
    for (size_t i = 0; i < n; ++i) {
        arr[i] *= factor;
    }
}
