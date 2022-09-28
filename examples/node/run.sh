#!/bin/bash

set -ex
npx tsc main.ts --target esnext
node main.js
