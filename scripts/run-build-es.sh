#!/bin/bash

rm -rf ./es
BABEL_ENV=es babel ./modules --out-dir es --ignore *.tape.js
