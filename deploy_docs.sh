#!/bin/bash
set -euo pipefail

tar -xvf upload/slang.tar.gz
rm -rf /var/www/sv-lang.com/html
cp -r build/docs/html/ /var/www/sv-lang.com/html/
cp build/bin/slang /home/ubuntu/slang-website/
rm -rf upload
rm -rf build
echo "Done"
