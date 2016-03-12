#!/bin/bash

rm -rf ./lib
babel ./modules -d lib --ignore *.ava.js
