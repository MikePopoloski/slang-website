FROM 		mpopoloski/slang:latest
MAINTAINER 	Mike Popoloski
CMD 		bash

RUN git clone https://github.com/MikePopoloski/slang.git
RUN cd slang && mkdir build && cd build && cmake -DCMAKE_CXX_COMPILER=g++-8 ..
RUN cd /slang && make -C build -j 8
RUN cp /slang/build/bin/driver /usr/local/bin/slang