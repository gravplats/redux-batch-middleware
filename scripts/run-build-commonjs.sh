#!/bin/bash

rm -rf ./lib
BABEL_END=commonjs babel ./modules --out-dir lib --ignore *.tape.js
