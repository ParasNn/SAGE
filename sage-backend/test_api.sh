#!/bin/bash

BASE_URL="http://localhost:8080/api/articles"

echo "Creating new tester article..."

RESPONSE=$(curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tester Article",
    "content": "Hello World! This is the text of the article",
    "author": "SQL Tester"
  }')

echo "Response from server:"
echo "$RESPONSE"
echo ""

echo "Retrieving all articles to verify..."
curl -s -X GET $BASE_URL | head -c 500 # Limit output in case there's a lot
echo "..."
echo ""
