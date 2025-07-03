#!/bin/bash

echo "🧹 Cleaning up test artifacts..."

# Remove test results
rm -rf test-results/
rm -rf reports/
rm -rf allure-results/
rm -rf allure-report/

# Remove logs
rm -f *.log
rm -f npm-debug.log*

# Remove coverage
rm -rf coverage/

# Recreate directories
mkdir -p reports/{html,json,allure,performance,security,screenshots}
mkdir -p test-results

echo "✅ Cleanup complete!"