#!/usr/bin/env bash

set -e

RUN_DIR=$(pwd)

SCRIPT_DIR=$(
  cd $(dirname "$0")
  pwd
)

clear() {
    rm -rf ./dist/*
}

tsc() {
    ./node_modules/.bin/tsc --project tsconfig.build.json --skipLibCheck
}

copy() {
    cp ./package.json ./dist/package.json
    cp ./package-lock.json ./dist/package-lock.json
}

install() {
    cd ./dist
    npm ci --production
    cd ..
}

compile() {
    clear
    tsc
    copy
    install
}

start() {
    cd "$SCRIPT_DIR" && cd ..
    compile
    cd "$RUN_DIR"
}

start
