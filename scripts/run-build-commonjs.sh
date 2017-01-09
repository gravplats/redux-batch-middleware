#!/bin/bash

rm -rf ./lib
BABEL_ENV=commonjs babel ./modules --out-dir lib --ignore *.tape.js
