## basic-auth
```
apt-get install apache2-utils
htpasswd -bc /var/www/html/.htpasswd user1 password

location /monitor {
     auth_basic        "input you user name and password";
     auth_basic_user_file    /var/www/html/.htpasswd;
     proxy_pass http://blog;
}

```