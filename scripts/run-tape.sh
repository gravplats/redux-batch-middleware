#!/bin/bash

tape --require babel-register './modules/**/*.tape.js' | faucet
