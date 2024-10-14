#!/bin/bash

npx vite build --mode client --watch &
npx vite build --watch &
node --watch dist/server.mjs
