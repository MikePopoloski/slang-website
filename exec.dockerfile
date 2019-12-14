FROM 		ubuntu:eoan
MAINTAINER 	Mike Popoloski
CMD 		bash

RUN apt-get update && apt-get install -y \
	apt-utils \
	build-essential \
	git \
	doxygen \
	xz-utils \
	g++-9 \
	cmake \
	python3 \
	python3-distutils \
	python3-setuptools \
	python3-pip

RUN pip3 install conan && conan user

RUN git clone https://github.com/MikePopoloski/slang.git
RUN cd slang && mkdir build && cd build && cmake -DCMAKE_CXX_COMPILER=g++-9 ..
RUN cd /slang && make -C build
RUN cp /slang/build/bin/driver /usr/local/bin/slang