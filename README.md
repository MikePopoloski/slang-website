slan-website
============
Source code and content for the slang (SystemVerilog language) compiler project's website.

### Deploying
Notes for deploying / running a fresh copy of the web server:
```
ssh aws
cd slang-website
git pull
docker pull mpopoloski/slang-web
sudo NODE_ENV=production pm2 start app.js -- --port 80
```