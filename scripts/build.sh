#!/usr/bin/env bash

set -e

RUN_DIR=$(pwd)

SCRIPT_DIR=$(
  cd $(dirname "$0")
  pwd
)

clear_dist() {
    rm -rf ./dist/*
}

run_tsc() {
    ./node_modules/.bin/tsc --skipLibCheck
}

copy_configuration_files() {
    cp ./package.json ./dist/package.json
    cp ./package-lock.json ./dist/package-lock.json
}

install_dependencies() {
    cd ./dist
    npm ci --production
    cd ..
}

compile() {
    clear_dist
    run_tsc
    copy_configuration_files
    install_dependencies
}

start() {
    cd "$SCRIPT_DIR" && cd ..
    compile
    cd "$RUN_DIR"
}

start
