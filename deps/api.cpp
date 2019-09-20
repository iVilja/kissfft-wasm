#include <emscripten.h>

#include "kissfft/kiss_fft.h"

extern "C" {

    EMSCRIPTEN_KEEPALIVE
    void fft(int nfft, const float *fin, float *fout) {
        auto cfg = kiss_fft_alloc(nfft, true, 0, 0);
        kiss_fft(cfg, (const kiss_fft_cpx *)fin, (kiss_fft_cpx *)fout);
        kiss_fft_free(cfg);
    }

    EMSCRIPTEN_KEEPALIVE
    void ifft() {
    }

    void fft2d() {
    }

    void ifft2d() {
    }

    void fftnd() {
    }

    void ifftnd() {
    }

    void rfft() {
    }

    void irfft() {
    }

    void rfft2d() {
    }

    void irfft2d() {
    }

    void rfftnd() {
    }

    void irfftnd() {
    }

}
