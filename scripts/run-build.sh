#!/bin/bash

rimraf ./lib
babel ./modules -d lib --ignore *.ava.js
