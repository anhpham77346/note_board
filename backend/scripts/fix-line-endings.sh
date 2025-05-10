#!/bin/sh

# Convert CRLF to LF for all shell scripts
echo "Converting line endings for shell scripts..."
find /app/scripts -type f -name "*.sh" -exec sed -i 's/\r$//' {} \;

echo "Line endings fixed." 