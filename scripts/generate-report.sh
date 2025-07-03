#!/bin/bash

echo "📊 Generating comprehensive test reports..."

# Generate HTML report
echo "🌐 Generating HTML report..."
npx playwright show-report --host=0.0.0.0 --port=9323 &

# Generate Allure report
echo "📈 Generating Allure report..."
npm run test:allure

# Generate performance report
echo "🚀 Generating performance report..."
npm run performance:analyze

# Generate security report
echo "🛡️ Generating security report..."
npm run security:scan

echo "✅ All reports generated successfully!"
echo "📋 Reports available at:"
echo "  - HTML: http://localhost:9323"
echo "  - Allure: ./allure-report/index.html"
echo "  - Performance: ./reports/performance/"
echo "  - Security: ./reports/security/"