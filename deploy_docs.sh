#!/bin/sh
set -euo pipefail

pwd
tar -xvf slang.tar.gz
rm -rf /var/www/sv-lang.com/html
cp -r build/docs/html/ /var/www/sv-lang.com/html/
cp slang /home/ubuntu/slang-website/
