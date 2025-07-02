#!/bin/bash

# Navigate to the root directory (in case the script is executed from somewhere else)
cd "$(dirname "$0")/.."


# Optional: install lambda dependencies
if [ -f lambda/pre-token-generation/package.json ]; then
  echo "Installing lambda dependencies..."
  (cd lambda/pre-token-generation && npm install)
else
  echo "No package.json found in $LAMBDA_DIR. Skipping npm install.";
fi

# cd "$(dirname "$0")"
# pwd

cdk synth --app "npx ts-node --esm bin/cognito.ts" && echo "Sync OK"

echo "Proceed to deploy...";

cdk deploy && echo "Deploy complete" && exit 0;

echo "Error during cdk deploy"

echo 1;