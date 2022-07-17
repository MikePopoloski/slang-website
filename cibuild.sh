#!/bin/sh

# This script checks a git repository for changes and, if it finds them,
# pulls, runs a build, and then copies the artifacts to an output directory.

export PATH=$PATH:/home/ubuntu/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export PYTHONPATH=/home/ubuntu/.local/lib/python3.6/site-packages

cd /home/ubuntu/slang
git fetch

LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse '@{u}')
if [ $LOCAL != $REMOTE ] || [ ! -z $1 ]; then
	echo "Starting" | ts
	cd ../m.css/
	git pull
	cd ../slang/
	git pull
	git submodule update --init --recursive
	rm -rf build
	mkdir build
	cd build
	cmake -DSLANG_INCLUDE_DOCS=ON -DSLANG_INCLUDE_TESTS=OFF -DDOXYGENPY_PATH=/home/ubuntu/m.css/documentation/doxygen.py ..
	make docs
	rm -rf /var/www/sv-lang.com/html
	cp -r docs/html/ /var/www/sv-lang.com/html/
	cp bin/slang /home/ubuntu/slang-website/
fi