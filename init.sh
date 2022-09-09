# This script initializes a new server for hosting the slang website.

# ------------ as sudo

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -yq

# Add nodejs PPA
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

# Install other apt packages
apt-get install -y nodejs docker.io nginx unzip

# systemctl setup
systemctl start docker
systemctl enable docker

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
git clone https://github.com/MikePopoloski/slang-website.git

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
docker pull ubuntu:latest
usermod -aG docker $USER

# Setup nginx website
cp sv-lang.com /etc/nginx/sites-available/
rm /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/sv-lang.com /etc/nginx/sites-enabled/sv-lang.com
mkdir /var/www/sv-lang.com

# Reload nginx
nginx -s reload

# Run let's encrypt / certbot setup

# ------------ non-sudo

NODE_ENV=production pm2 start app.js -- --port 6789
pm2 save
