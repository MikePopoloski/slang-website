# This script initializes a new server for hosting the slang website.

# ------------ as sudo

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -yq

# Add cmake PPA
apt-get install -y apt-transport-https
wget -O - https://apt.kitware.com/keys/kitware-archive-latest.asc 2>/dev/null | apt-key add -
apt-add-repository 'deb https://apt.kitware.com/ubuntu/ bionic main'
apt-get update

# Add nodejs PPA
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

# Install other apt packages
apt-get install -y python3-pip cmake nodejs docker.io nginx unzip

# Install doxygen
wget http://doxygen.nl/files/doxygen-1.8.17.linux.bin.tar.gz
tar -xvf doxygen-1.8.17.linux.bin.tar.gz
cp doxygen-1.8.17/bin/doxygen /usr/local/bin
rm doxygen-1.8.17.linux.bin.tar.gz
rm -rf doxygen-1.8.17

# systemctl setup
systemctl start docker
systemctl enable docker

# Install Python packages
pip3 install conan

# Install node tools
npm install pm2 -g
env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu

# ------------ non-sudo

# Configure profile
cd /home/ubuntu
echo "\$include /etc/inputrc" >> .inputrc
echo "\"\e[A\":history-search-backward" >> .inputrc
echo "\"\e[B\":history-search-forward" >> .inputrc

# Checkout code
git clone https://github.com/MikePopoloski/slang.git
git clone https://github.com/MikePopoloski/slang-website.git
git clone https://github.com/MikePopoloski/m.css.git

# Setup nodejs app
cd slang-website
npm install

# Outside of script, login to docker, interactively:
# sudo docker login
#
# Also upload static webpack bundle to slang-website/static/
# scp static.zip aws:/home/ubuntu/slang-website
# unzip static.zip
# rm static.zip

# ------------ sudo again

# Docker setup
docker pull mpopoloski/slang-website
usermod -aG docker $USER

# Setup nginx website
cp sv-lang.com /etc/nginx/sites-available/
rm /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/sv-lang.com /etc/nginx/sites-enabled/sv-lang.com
mkdir /var/www/sv-lang.com

# Do initial doc build
cd /home/ubuntu/slang
git reset --hard HEAD~1
/home/ubuntu/slang-website/docbuild.sh

# Reload nginx
nginx -s reload

# Setup crontab to automatically do docbuild
# sudo crontab -e
# */5 * * * * /home/ubuntu/slang-website/docbuild.sh 2>&1 >> /var/log/docbuild

# Run let's encrypt / certbot setup

# ------------ non-sudo

NODE_ENV=production pm2 start app.js -- --port 6789
pm2 save