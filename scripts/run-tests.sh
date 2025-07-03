#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="dev"
BROWSER="chromium"
HEADLESS=true
PARALLEL=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -b|--browser)
            BROWSER="$2"
            shift 2
            ;;
        -h|--headed)
            HEADLESS=false
            shift
            ;;
        -p|--parallel)
            PARALLEL=true
            shift
            ;;
        *)
            echo "Unknown option $1"
            exit 1
            ;;
    esac
done

echo -e "${GREEN}🎭 Running Playwright Tests${NC}"
echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo -e "${YELLOW}Browser: $BROWSER${NC}"
echo -e "${YELLOW}Headless: $HEADLESS${NC}"
echo -e "${YELLOW}Parallel: $PARALLEL${NC}"

# Build test command
TEST_CMD="npx playwright test --config=configs/environments/${ENVIRONMENT}.config.js"

if [ "$HEADLESS" = false ]; then
    TEST_CMD="$TEST_CMD --headed"
fi

if [ "$PARALLEL" = true ]; then
    TEST_CMD="$TEST_CMD --workers=4"
fi

# Run tests
echo -e "${GREEN}🚀 Starting test execution...${NC}"
eval $TEST_CMD

# Check test results
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
else
    echo -e "${RED}❌ Some tests failed!${NC}"
    exit 1
fi