server {
    listen 80;
    server_name sv-lang.com www.sv-lang.com;

    root /var/www/sv-lang.com/html/;

    location = /explore {
        return 302 /explore/;
    }

    location /explore/ {
        proxy_pass http://localhost:6789/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
     }
}