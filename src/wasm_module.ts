export interface WASMModule {
  then(cb: () => void): WASMModule
  cwrap<F>(name: string, outputType: string, inputTypes: string[]): F

  _kiss_fft_alloc(nfft: number, inverse: boolean, mem: number, lenmem: number): number
  _kiss_fft(cfg: number, fin: number, fout: number): void

  _fft(nfft: number, fin: number, fout: number): void

  _free(ptr: number): void
}
