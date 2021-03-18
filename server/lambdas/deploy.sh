#!/bin/bash

dirs=("books")

for dir in $dirs; do
  cd $dir
  GOOS=linux go build -o main main.go
  zip -jrm main.zip main

  # aws lambda create-function --function-name books_handler --runtime go1.x --zip-file fileb://main.zip --handler main --role $AWS_ROLE
  aws lambda update-function-code --function-name books_handler  --zip-file fileb://main.zip

  cd ..
done

