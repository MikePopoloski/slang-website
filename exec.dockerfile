FROM 		mpopoloski/slang:1.1
MAINTAINER 	Mike Popoloski
CMD 		bash

RUN git clone https://github.com/MikePopoloski/slang.git
RUN cd slang && scripts/bin/linux/genie --gcc=linux-gcc gmake
RUN cd /slang && make -C build/projects/gmake-linux -j 4 CXX=g++-7
RUN cd /slang && cp build/linux64_gcc/bin/driverDebug /usr/local/bin/slang