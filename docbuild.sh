#!/bin/sh

# This script checks a git repository for changes and, if it finds them,
# pulls, runs a build of the docs, and then copies them to an output directory.

cd /home/ubuntu/slang
git fetch

LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse '@{u}')
if [ $LOCAL != $REMOTE ]; then
	cd ../m.css/
	git pull
	cd ../slang/
	git pull
	rm -rf build
	mkdir build
	cd build
	cmake -DSLANG_INCLUDE_DOCS=ON -DSLANG_INCLUDE_TESTS=OFF -DDOXYGENPY_PATH=/home/ubuntu/m.css/documentation/doxygen.py ..
	make docs
	rm -rf /var/www/sv-lang.com/html
	cp -r docs/html/ /var/www/sv-lang.com/html/
fi