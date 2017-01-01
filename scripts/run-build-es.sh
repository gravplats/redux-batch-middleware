#!/bin/bash

rm -rf ./lib
BABEL_ENV=es babel ./modules --out-dir es --ignore *.tape.js
