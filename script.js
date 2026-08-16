/* ============================================================
   DATA LAYER (DEFAULT TOOLS)
   ============================================================ */
const DEFAULT_TOOLS = [
  // Control Panels
  { slug:'nginx-proxy-manager', name:'Nginx Proxy Manager', icon:'🌐', description:'Manage Nginx proxy hosts with a beautiful web UI and free SSL certificates.', category:'Control Panels', difficulty:'Easy', os:'Ubuntu 20.04+', docker:true, minRam:512, estRam:200, estDisk:400, featured:true, lowRam:true, website:'https://nginxproxymanager.com',
    install:`mkdir -p /opt/npm && cd /opt/npm\ncurl -o docker-compose.yml https://raw.githubusercontent.com/NginxProxyManager/nginx-proxy-manager/v2.12.1/docker/docker-compose.yml\ndocker compose up -d`,
    steps:['Create a directory for Nginx Proxy Manager','Download the official docker-compose file','Start the stack with docker compose','Access the UI at http://your-ip:81'],
    requirements:['Docker and Docker Compose','Minimum 512 MB RAM','Ports 80, 443, 81 open'],
    useful:['docker compose logs -f','docker compose restart','docker compose down'],
    related:['caddy','portainer','cloudpanel']
  },
  { slug:'cloudpanel', name:'CloudPanel', icon:'☁️', description:'Lightweight, fast control panel for cloud servers. Nginx, Node.js, PHP.', category:'Control Panels', difficulty:'Easy', os:'Ubuntu 22.04 / 24.04', docker:false, minRam:1024, estRam:600, estDisk:1500, featured:true, lowRam:false, website:'https://cloudpanel.io',
    install:`curl -sS https://installer.cloudpanel.io/install.sh | sudo bash`,
    steps:['Update your server','Run the install script','Wait for completion (about 5 minutes)','Access the UI at https://your-ip:8443'],
    requirements:['Fresh Ubuntu 22.04 or 24.04','Minimum 1 GB RAM','Root access'],
    useful:['clpctl system:status','clpctl site:add','clpctl user:list'],
    related:['hestiacp','aapanel','cyberpanel']
  },
  { slug:'hestiacp', name:'HestiaCP', icon:'🖥️', description:'Powerful, open-source web hosting control panel for Linux servers.', category:'Control Panels', difficulty:'Medium', os:'Debian 11+ / Ubuntu 20.04+', docker:false, minRam:1024, estRam:700, estDisk:2000, featured:false, lowRam:false, website:'https://hestiacp.com',
    install:`wget https://raw.githubusercontent.com/hestiacp/hestiacp/release/install/hst-install.sh\nsudo bash hst-install.sh`,
    steps:['Download the installer script','Run it with sudo privileges','Follow interactive prompts','Access the admin panel at https://your-ip:8083'],
    requirements:['Debian 11+ or Ubuntu 20.04+','Minimum 1 GB RAM','Root access'],
    useful:['v-list-sys-config','v-add-user','v-restart-service'],
    related:['cloudpanel','aapanel','cyberpanel']
  },
  { slug:'aapanel', name:'aaPanel', icon:'⚙️', description:'Lightweight Linux panel with a web-based GUI and 1-click LNMP/LAMP stack.', category:'Control Panels', difficulty:'Easy', os:'Ubuntu / CentOS', docker:false, minRam:512, estRam:400, estDisk:1000, featured:false, lowRam:true, website:'https://www.aapanel.com',
    install:`wget -O install.sh http://www.aapanel.com/script/install_7.0_en.sh && sudo bash install.sh aapanel`,
    steps:['Run the install command','Follow the setup wizard','Login with provided credentials','Install extensions from the app store'],
    requirements:['Ubuntu 20+ / CentOS 7+','Minimum 512 MB RAM','Root access'],
    useful:['bt default','bt restart','bt status'],
    related:['cloudpanel','hestiacp','cyberpanel']
  },
  { slug:'cyberpanel', name:'CyberPanel', icon:'🚀', description:'High-performance hosting control panel powered by OpenLiteSpeed.', category:'Control Panels', difficulty:'Medium', os:'Ubuntu / AlmaLinux', docker:false, minRam:1024, estRam:800, estDisk:2000, featured:false, lowRam:false, website:'https://cyberpanel.net',
    install:`sh <(curl https://cyberpanel.net/install.sh || wget -O - https://cyberpanel.net/install.sh)`,
    steps:['Run the installer script','Choose OpenLiteSpeed','Set admin password','Access https://your-ip:8090'],
    requirements:['Ubuntu 20.04+ / AlmaLinux','Minimum 1 GB RAM','Root access'],
    useful:['cyberpanel restart','cyberpanel status'],
    related:['cloudpanel','hestiacp','aapanel']
  },

  // Container Management
  { slug:'docker', name:'Docker', icon:'🐳', description:'Run, ship, and manage applications inside lightweight containers.', category:'Container Management', difficulty:'Easy', os:'Ubuntu 20.04+', docker:false, minRam:512, estRam:150, estDisk:500, featured:true, lowRam:true, website:'https://docker.com',
    install:`curl -fsSL https://get.docker.com | sh\nsudo usermod -aG docker $USER`,
    steps:['Run the Docker install script','Add your user to the docker group','Log out and log back in','Verify with docker --version'],
    requirements:['Ubuntu 20.04+ or Debian 11+','Minimum 512 MB RAM','Root or sudo access'],
    useful:['docker ps','docker images','docker system prune','docker logs <container>'],
    related:['docker-compose','portainer','dockge']
  },
  { slug:'docker-compose', name:'Docker Compose', icon:'🎼', description:'Define and run multi-container Docker apps with a YAML file.', category:'Container Management', difficulty:'Easy', os:'Any Docker host', docker:true, minRam:256, estRam:100, estDisk:100, featured:false, lowRam:true, website:'https://docs.docker.com/compose/',
    install:`sudo apt update && sudo apt install docker-compose-plugin -y\ndocker compose version`,
    steps:['Install the Compose plugin','Verify installation','Create a docker-compose.yml','Run docker compose up -d'],
    requirements:['Docker installed','Root or sudo access'],
    useful:['docker compose up -d','docker compose down','docker compose logs -f','docker compose ps'],
    related:['docker','portainer','dockge']
  },
  { slug:'portainer', name:'Portainer', icon:'📦', description:'A lightweight management UI for Docker, Swarm, Kubernetes, and ACI.', category:'Container Management', difficulty:'Easy', os:'Any Docker host', docker:true, minRam:256, estRam:200, estDisk:300, featured:true, lowRam:true, website:'https://www.portainer.io',
    install:`docker volume create portainer_data\ndocker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always \\\n  -v /var/run/docker.sock:/var/run/docker.sock \\\n  -v portainer_data:/data portainer/portainer-ce:latest`,
    steps:['Create a Docker volume for data','Run the Portainer container','Access https://your-ip:9443','Create admin account'],
    requirements:['Docker installed','Minimum 256 MB RAM','Ports 9443 and 8000 open'],
    useful:['docker ps','docker restart portainer','docker logs portainer'],
    related:['docker','dockge','nginx-proxy-manager']
  },
  { slug:'dockge', name:'Dockge', icon:'⚓', description:'Modern, reactive Docker Compose manager with a beautiful UI.', category:'Container Management', difficulty:'Easy', os:'Any Docker host', docker:true, minRam:256, estRam:150, estDisk:200, featured:false, lowRam:true, website:'https://dockge.kuma.pet',
    install:`docker run -d --name dockge --restart unless-stopped -p 5001:5001 \\\n  -v /var/run/docker.sock:/var/run/docker.sock \\\n  -v dockge-data:/app/data \\\n  -v /opt/stacks:/opt/stacks louislam/dockge`,
    steps:['Run the Dockge container','Open http://your-ip:5001','Create your first stack','Use the built-in editor'],
    requirements:['Docker installed','Minimum 256 MB RAM','Port 5001 open'],
    useful:['docker logs dockge','docker restart dockge'],
    related:['portainer','docker','docker-compose']
  },

  // Automation
  { slug:'n8n', name:'n8n', icon:'⚡', description:'Free and open source workflow automation tool. Self-hostable Zapier alternative.', category:'Automation', difficulty:'Medium', os:'Any Docker host', docker:true, minRam:512, estRam:400, estDisk:500, featured:true, lowRam:true, website:'https://n8n.io',
    install:`docker volume create n8n_data\ndocker run -d --name n8n --restart always -p 5678:5678 \\\n  -v n8n_data:/home/node/.n8n n8nio/n8n`,
    steps:['Create a volume for data','Run the n8n container','Access http://your-ip:5678','Create your first workflow'],
    requirements:['Docker installed','Minimum 512 MB RAM','Port 5678 open'],
    useful:['docker logs n8n','docker restart n8n'],
    related:['node-red','docker','portainer']
  },
  { slug:'node-red', name:'Node-RED', icon:'🔗', description:'Flow-based programming tool for wiring together hardware, APIs, and services.', category:'Automation', difficulty:'Easy', os:'Any Docker host', docker:true, minRam:256, estRam:200, estDisk:300, featured:false, lowRam:true, website:'https://nodered.org',
    install:`docker run -d --name nodered --restart unless-stopped -p 1880:1880 \\\n  -v node_red_data:/data nodered/node-red`,
    steps:['Run Node-RED container','Open http://your-ip:1880','Install palette nodes','Build your first flow'],
    requirements:['Docker installed','Minimum 256 MB RAM','Port 1880 open'],
    useful:['docker logs nodered','docker restart nodered'],
    related:['n8n','docker']
  },

  // Security
  { slug:'vaultwarden', name:'Vaultwarden', icon:'🔑', description:'Alternative Bitwarden server written in Rust. Lightweight and perfect for self-hosting.', category:'Security', difficulty:'Easy', os:'Any Docker host', docker:true, minRam:256, estRam:100, estDisk:200, featured:true, lowRam:true, website:'https://github.com/dani-garcia/vaultwarden',
    install:`docker run -d --name vaultwarden -v /vw-data/:/data/ -p 8080:80 vaultwarden/server:latest`,
    steps:['Create a directory for data storage','Run the Vaultwarden container','Access http://your-ip:8080','Set up your master password'],
    requirements:['Docker installed','Minimum 256 MB RAM','Port 8080 free'],
    useful:['docker logs vaultwarden','docker restart vaultwarden'],
    related:['docker','fail2ban','ufw']
  },
  { slug:'ufw', name:'UFW Firewall', icon:'🛡️', description:'Uncomplicated Firewall — a simple CLI to manage iptables rules.', category:'Security', difficulty:'Easy', os:'Ubuntu / Debian', docker:false, minRam:64, estRam:20, estDisk:50, featured:true, lowRam:true, website:'https://help.ubuntu.com/community/UFW',
    install:`sudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow ssh\nsudo ufw allow 80,443/tcp\nsudo ufw enable`,
    steps:['Set default deny policy','Allow SSH to avoid lockout','Allow HTTP/HTTPS','Enable the firewall'],
    requirements:['Ubuntu / Debian','Root or sudo access'],
    useful:['sudo ufw status verbose','sudo ufw allow <port>','sudo ufw reload'],
    related:['fail2ban','crowdsec']
  },
  { slug:'fail2ban', name:'Fail2Ban', icon:'🔒', description:'Scan log files and ban IPs showing malicious signs (brute force, etc).', category:'Security', difficulty:'Easy', os:'Ubuntu / Debian', docker:false, minRam:128, estRam:60, estDisk:100, featured:true, lowRam:true, website:'https://www.fail2ban.org',
    install:`sudo apt update && sudo apt install fail2ban -y\nsudo systemctl enable fail2ban\nsudo systemctl start fail2ban`,
    steps:['Install fail2ban','Enable the service','Copy jail.local for customization','Restart and verify'],
    requirements:['Ubuntu / Debian','Root or sudo access'],
    useful:['sudo fail2ban-client status','sudo fail2ban-client status sshd','sudo fail2ban-client set sshd unbanip <IP>'],
    related:['ufw','crowdsec']
  },
  { slug:'crowdsec', name:'CrowdSec', icon:'👥', description:'Modern, collaborative IDS that blocks malicious IPs using a community feed.', category:'Security', difficulty:'Medium', os:'Ubuntu / Debian', docker:true, minRam:512, estRam:300, estDisk:500, featured:false, lowRam:true, website:'https://www.crowdsec.net',
    install:`curl -s https://install.crowdsec.net | sudo sh\ncscli hub install crowdsecurity/linux\ncscli collections install crowdsecurity/nginx`,
    steps:['Install the agent','Install detection scenarios','Install bouncers','Connect to the console (optional)'],
    requirements:['Ubuntu 20+ / Debian 11+','Root or sudo access'],
    useful:['sudo cscli metrics','sudo cscli decisions list','sudo cscli hub update'],
    related:['fail2ban','ufw']
  },

  // VPN & Networking
  { slug:'wireguard', name:'WireGuard', icon:'🌐', description:'Modern, extremely fast, simple, and secure VPN protocol.', category:'VPN & Networking', difficulty:'Hard', os:'Ubuntu / Debian', docker:false, minRam:64, estRam:50, estDisk:100, featured:true, lowRam:true, website:'https://www.wireguard.com',
    install:`sudo apt install wireguard -y\ncd /etc/wireguard\numask 077\nwg genkey | tee privatekey | wg pubkey > publickey`,
    steps:['Install WireGuard','Generate key pair','Create wg0.conf','Start the wg-quick service'],
    requirements:['Ubuntu 20.04+','Root access','Firewall rule for UDP 51820'],
    useful:['sudo wg','sudo systemctl status wg-quick@wg0','sudo wg-quick down wg0'],
    related:['wg-easy','tailscale']
  },
  { slug:'wg-easy', name:'wg-easy', icon:'🔐', description:'The easiest way to run WireGuard VPN + a web-based UI.', category:'VPN & Networking', difficulty:'Easy', os:'Any Docker host', docker:true, minRam:256, estRam:150, estDisk:200, featured:true, lowRam:true, website:'https://github.com/wg-easy/wg-easy',
    install:`docker run -d --name wg-easy --cap-add NET_ADMIN --cap-add SYS_MODULE \\\n  -e WG_HOST=your-public-ip -p 51820:51820/udp -p 51821:51821/tcp \\\n  -v wg-easy-data:/etc/wireguard ghcr.io/wg-easy/wg-easy`,
    steps:['Run the container','Access http://your-ip:51821','Add a client','Scan the QR code with your phone'],
    requirements:['Docker installed','Public IP','Ports 51820 UDP and 51821 TCP open'],
    useful:['docker logs wg-easy','docker restart wg-easy'],
    related:['wireguard','tailscale']
  },
  { slug:'tailscale', name:'Tailscale', icon:'🪢', description:'Zero-config VPN based on WireGuard. Connects devices instantly.', category:'VPN & Networking', difficulty:'Easy', os:'Ubuntu / Debian', docker:false, minRam:128, estRam:80, estDisk:100, featured:true, lowRam:true, website:'https://tailscale.com',
    install:`curl -fsSL https://tailscale.com/install.sh | sh\nsudo tailscale up`,
    steps:['Run the installer script','Start Tailscale','Authenticate via browser','Connect other devices the same way'],
    requirements:['Ubuntu 20.04+','Root or sudo access','Internet access'],
    useful:['tailscale status','tailscale ip','tailscale ping <device>'],
    related:['wireguard','wg-easy']
  },

  // DNS & Ad Blocking
  { slug:'adguard-home', name:'AdGuard Home', icon:'🛡️', description:'Network-wide ad and tracker blocking DNS server.', category:'DNS & Ad Blocking', difficulty:'Easy', os:'Any Docker host', docker:true, minRam:256, estRam:200, estDisk:200, featured:true, lowRam:true, website:'https://adguard.com/adguard-home/overview.html',
    install:`docker run -d --name adguardhome --restart unless-stopped \\\n  -v adguard-work:/opt/adguardhome/work \\\n  -v adguard-conf:/opt/adguardhome/conf \\\n  -p 53:53/tcp -p 53:53/udp -p 3000:3000 adguard/adguardhome`,
    steps:['Run the container','Open http://your-ip:3000','Run the setup wizard','Change your DNS to the server'],
    requirements:['Docker installed','Ports 53 and 3000 free','Minimum 256 MB RAM'],
    useful:['docker logs adguardhome','docker restart adguardhome'],
    related:['pi-hole','unbound']
  },
  { slug:'pi-hole', name:'Pi-hole', icon:'🥧', description:'A black hole for internet ads. Lightweight DNS sinkhole.', category:'DNS & Ad Blocking', difficulty:'Easy', os:'Ubuntu / Debian', docker:true, minRam:256, estRam:180, estDisk:200, featured:true, lowRam:true, website:'https://pi-hole.net',
    install:`curl -sSL https://install.pi-hole.net | bash`,
    steps:['Run the installer','Choose upstream DNS','Pick blocklists','Set the admin password'],
    requirements:['Ubuntu / Debian','Root access','Port 53, 80, 443 free'],
    useful:['pihole -a','pihole -q example.com','pihole status'],
    related:['adguard-home','unbound']
  },

  // Databases
  { slug:'mariadb', name:'MariaDB', icon:'🗄️', description:'A robust, open source relational database, drop-in replacement for MySQL.', category:'Databases', difficulty:'Easy', os:'Ubuntu / Debian', docker:true, minRam:256, estRam:300, estDisk:500, featured:false, lowRam:true, website:'https://mariadb.org',
    install:`docker run -d --name mariadb --restart always -p 3306:3306 \\\n  -e MYSQL_ROOT_PASSWORD=change-me -v mariadb-data:/var/lib/mysql \\\n  mariadb:latest`,
    steps:['Run the container','Set a strong root password','Create databases and users','Connect with any MySQL client'],
    requirements:['Docker installed','Minimum 256 MB RAM','Port 3306 open (optional)'],
    useful:['docker exec -it mariadb mysql -uroot -p','docker logs mariadb'],
    related:['postgresql','phpmyadmin','adminer']
  },
  { slug:'postgresql', name:'PostgreSQL', icon:'🐘', description:'Powerful, open source object-relational database system.', category:'Databases', difficulty:'Medium', os:'Ubuntu / Debian', docker:true, minRam:512, estRam:300, estDisk:500, featured:false, lowRam:true, website:'https://www.postgresql.org',
    install:`docker run -d --name postgres --restart always -p 5432:5432 \\\n  -e POSTGRES_PASSWORD=change-me -v postgres-data:/var/lib/postgresql/data \\\n  postgres:16`,
    steps:['Run the container','Set a strong password','Connect via psql or any client','Create databases and users'],
    requirements:['Docker installed','Minimum 512 MB RAM','Port 5432 open (optional)'],
    useful:['docker exec -it postgres psql -U postgres','docker logs postgres'],
    related:['mariadb','adminer']
  },
  { slug:'redis', name:'Redis', icon:'🔴', description:'In-memory data store used as database, cache, and message broker.', category:'Databases', difficulty:'Easy', os:'Ubuntu / Debian', docker:true, minRam:64, estRam:80, estDisk:50, featured:false, lowRam:true, website:'https://redis.io',
    install:`docker run -d --name redis --restart always -p 6379:6379 \\\n  -v redis-data:/data redis:7 redis-server --appendonly yes`,
    steps:['Run the container','Enable AOF persistence','Connect with redis-cli','Configure auth in production'],
    requirements:['Docker installed','Minimum 64 MB RAM','Port 6379 open (optional)'],
    useful:['docker exec -it redis redis-cli','docker logs redis'],
    related:['mariadb','postgresql']
  },
  { slug:'phpmyadmin', name:'phpMyAdmin', icon:'🧑‍💻', description:'A free web-based tool to manage MySQL and MariaDB databases.', category:'Databases', difficulty:'Easy', os:'Any Docker host', docker:true, minRam:256, estRam:200, estDisk:300, featured:false, lowRam:true, website:'https://www.phpmyadmin.net',
    install:`docker run -d --name phpmyadmin --restart always -p 8080:80 \\\n  -e PMA_HOST=mariadb phpmyadmin/phpmyadmin`,
    steps:['Run the container','Point to your MariaDB host','Open http://your-ip:8080','Login with DB credentials'],
    requirements:['Docker installed','A running MariaDB / MySQL','Port 8080 open'],
    useful:['docker logs phpmyadmin','docker restart phpmyadmin'],
    related:['mariadb','adminer']
  },
  { slug:'adminer', name:'Adminer', icon:'🧰', description:'A lightweight, single-file database manager supporting MySQL, PostgreSQL, SQLite.', category:'Databases', difficulty:'Easy', os:'Any Docker host', docker:true, minRam:128, estRam:120, estDisk:50, featured:false, lowRam:true, website:'https://www.adminer.cz',
    install:`docker run -d --name adminer --restart always -p 8081:80 adminer`,
    steps:['Run the container','Open http://your-ip:8081','Choose the database driver','Login with credentials'],
    requirements:['Docker installed','Port 8081 open'],
    useful:['docker logs adminer','docker restart adminer'],
    related:['phpmyadmin','mariadb']
  },

  // Monitoring & Analytics
  { slug:'netdata', name:'Netdata', icon:'📊', description:'Real-time performance and health monitoring for systems and applications.', category:'Monitoring', difficulty:'Easy', os:'Ubuntu / Debian', docker:true, minRam:256, estRam:250, estDisk:300, featured:true, lowRam:true, website:'https://www.netdata.cloud',
    install:`wget -O /tmp/netdata-kickstart.sh https://get.netdata.cloud/kickstart.sh && sh /tmp/netdata-kickstart.sh`,
    steps:['Run the kickstart installer','Claim your node to Netdata Cloud','Access http://your-ip:19999','Explore real-time dashboards'],
    requirements:['Ubuntu 20.04+ / Debian 11+','Root or sudo','Port 19999 open'],
    useful:['sudo systemctl status netdata','sudo systemctl restart netdata'],
    related:['uptime-kuma','glances']
  },
  { slug:'uptime-kuma', name:'Uptime Kuma', icon:'💚', description:'A fancy self-hosted uptime monitoring tool. Beautiful UI, many protocols.', category:'Monitoring', difficulty:'Easy', os:'Any Docker host', docker:true, minRam:256, estRam:200, estDisk:300, featured:true, lowRam:true, website:'https://github.com/louislam/uptime-kuma',
    install:`docker run -d --name uptime-kuma --restart always -p 3001:3001 \\\n  -v uptime-kuma-data:/app/data louislam/uptime-kuma:1`,
    steps:['Run the container','Open http://your-ip:3001','Create your admin user','Add your first monitor'],
    requirements:['Docker installed','Minimum 256 MB RAM','Port 3001 open'],
    useful:['docker logs uptime-kuma','docker restart uptime-kuma'],
    related:['netdata','glances']
  },
  { slug:'umami', name:'Umami Analytics', icon:'📈', description:'A simple, fast, privacy-focused alternative to Google Analytics.', category:'Monitoring', difficulty:'Easy', os:'Any Docker host', docker:true, minRam:512, estRam:200, estDisk:300, featured:false, lowRam:true, website:'https://umami.is',
    install:`mkdir -p /opt/umami && cd /opt/umami\ncurl -o docker-compose.yml https://raw.githubusercontent.com/umami-software/umami/master/docker-compose.yml\ndocker compose up -d`,
    steps:['Create a folder for Umami','Download the official docker-compose file','Start the database and app using docker compose','Open http://your-ip:3000 (username: admin, password: umami)'],
    requirements:['Docker and Docker Compose','Minimum 512 MB RAM','Port 3000 free'],
    useful:['docker compose logs -f','docker compose down','docker compose restart'],
    related:['docker','docker-compose','uptime-kuma']
  },
  { slug:'glances', name:'Glances', icon:'👁️', description:'Cross-platform monitoring tool. A modern alternative to top/htop.', category:'Monitoring', difficulty:'Easy', os:'Ubuntu / Debian', docker:false, minRam:64, estRam:50, estDisk:50, featured:false, lowRam:true, website:'https://nicolargo.github.io/glances/',
    install:`curl -L https://bit.ly/glances | /bin/bash`,
    steps:['Run the installer','Launch glances in terminal','Use web UI: glances -w','Explore stats'],
    requirements:['Python 3','Root or sudo (optional)'],
    useful:['glances','glances -w','glances --export csv'],
    related:['netdata','uptime-kuma']
  },

  // Web Servers
  { slug:'nginx', name:'Nginx', icon:'🌍', description:'High-performance HTTP server and reverse proxy. Industry standard.', category:'Web Servers', difficulty:'Medium', os:'Ubuntu / Debian', docker:true, minRam:64, estRam:80, estDisk:100, featured:true, lowRam:true, website:'https://nginx.org',
    install:`sudo apt update && sudo apt install nginx -y\nsudo systemctl enable nginx\nsudo systemctl start nginx`,
    steps:['Install nginx','Enable on boot','Start the service','Verify by visiting http://your-ip'],
    requirements:['Ubuntu / Debian','Root or sudo','Ports 80, 443 open'],
    useful:['sudo nginx -t','sudo systemctl reload nginx','sudo tail -f /var/log/nginx/access.log'],
    related:['caddy','apache','nginx-proxy-manager']
  },
  { slug:'apache', name:'Apache', icon:'🪶', description:'Widely used open-source web server, reliable and flexible.', category:'Web Servers', difficulty:'Medium', os:'Ubuntu / Debian', docker:false, minRam:128, estRam:100, estDisk:150, featured:false, lowRam:true, website:'https://httpd.apache.org',
    install:`sudo apt update && sudo apt install apache2 -y\nsudo systemctl enable apache2`,
    steps:['Install Apache','Enable on boot','Visit http://your-ip','Configure virtual hosts'],
    requirements:['Ubuntu / Debian','Root or sudo','Ports 80, 443 open'],
    useful:['sudo apache2ctl configtest','sudo systemctl reload apache2'],
    related:['nginx','caddy']
  },
  { slug:'caddy', name:'Caddy', icon:'🎩', description:'Modern web server with automatic HTTPS by default. Written in Go.', category:'Web Servers', difficulty:'Easy', os:'Ubuntu / Debian', docker:true, minRam:128, estRam:150, estDisk:200, featured:true, lowRam:true, website:'https://caddyserver.com',
    install:`sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl\ncurl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg\ncurl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list\nsudo apt update && sudo apt install caddy`,
    steps:['Add Caddy repo','Install Caddy','Edit /etc/caddy/Caddyfile','Reload Caddy'],
    requirements:['Ubuntu 20.04+','Root or sudo','Ports 80, 443 open'],
    useful:['caddy version','sudo systemctl reload caddy','caddy list-modules'],
    related:['nginx','apache','nginx-proxy-manager']
  },
  { slug:'php', name:'PHP', icon:'🐘', description:'Widely used general-purpose scripting language for web development.', category:'Web Servers', difficulty:'Easy', os:'Ubuntu / Debian', docker:false, minRam:256, estRam:200, estDisk:500, featured:false, lowRam:true, website:'https://www.php.net',
    install:`sudo apt update && sudo apt install php8.3-fpm php8.3-cli php8.3-mysql php8.3-curl php8.3-gd php8.3-mbstring php8.3-xml -y`,
    steps:['Install PHP 8.3','Add common extensions','Verify with php -v','Configure PHP-FPM with Nginx'],
    requirements:['Ubuntu 22.04+','Root or sudo'],
    useful:['php -v','php -m','sudo systemctl status php8.3-fpm'],
    related:['nginx','apache']
  },
  { slug:'nodejs', name:'Node.js', icon:'🟢', description:'JavaScript runtime built on Chrome\'s V8 engine for server-side apps.', category:'Web Servers', difficulty:'Easy', os:'Ubuntu / Debian', docker:false, minRam:128, estRam:200, estDisk:300, featured:true, lowRam:true, website:'https://nodejs.org',
    install:`curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -\nsudo apt install -y nodejs`,
    steps:['Add NodeSource repo','Install Node.js','Verify with node -v','Install pm2 for production'],
    requirements:['Ubuntu 20.04+','Root or sudo'],
    useful:['node -v','npm -v','npm install -g pm2'],
    related:['docker','nginx']
  }
];

const CATEGORIES = [
  { name:'Control Panels',       emoji:'🖥️', color:'from-blue-500 to-cyan-500' },
  { name:'Container Management', emoji:'🐳', color:'from-sky-500 to-blue-600' },
  { name:'Automation',           emoji:'⚡', color:'from-yellow-400 to-orange-500' },
  { name:'Security',             emoji:'🔒', color:'from-red-500 to-rose-600' },
  { name:'VPN & Networking',     emoji:'🌐', color:'from-indigo-500 to-purple-600' },
  { name:'DNS & Ad Blocking',    emoji:'🛡️', color:'from-emerald-500 to-teal-600' },
  { name:'Databases',            emoji:'🗄️', color:'from-purple-500 to-fuchsia-600' },
  { name:'Monitoring',           emoji:'📊', color:'from-pink-500 to-rose-600' },
  { name:'Web Servers',          emoji:'🚀', color:'from-cyan-500 to-blue-600' }
];

const QUICK_INSTALLS = [
  { title:'Install Docker',          cmd:'curl -fsSL https://get.docker.com | sh' },
  { title:'Install Portainer',       cmd:'docker volume create portainer_data\ndocker run -d -p 9443:9443 --name portainer --restart=always \\\n  -v /var/run/docker.sock:/var/run/docker.sock \\\n  -v portainer_data:/data portainer/portainer-ce:latest' },
  { title:'Install Uptime Kuma',     cmd:'docker run -d --name uptime-kuma --restart always -p 3001:3001 \\\n  -v uptime-kuma-data:/app/data louislam/uptime-kuma:1' },
  { title:'Install Nginx Proxy Manager', cmd:'mkdir -p /opt/npm && cd /opt/npm\ncurl -o docker-compose.yml https://raw.githubusercontent.com/NginxProxyManager/nginx-proxy-manager/v2.12.1/docker/docker-compose.yml\ndocker compose up -d' },
  { title:'Install AdGuard Home',    cmd:'docker run -d --name adguardhome --restart unless-stopped \\\n  -v adguard-work:/opt/adguardhome/work \\\n  -v adguard-conf:/opt/adguardhome/conf \\\n  -p 53:53/tcp -p 53:53/udp -p 3000:3000 adguard/adguardhome' },
  { title:'Install Tailscale',       cmd:'curl -fsSL https://tailscale.com/install.sh | sh\nsudo tailscale up' },
  { title:'Install CloudPanel',      cmd:'curl -sS https://installer.cloudpanel.io/install.sh | sudo bash' },
  { title:'Install Node.js 22',      cmd:'curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -\nsudo apt install -y nodejs' }
];

const VARIABLES_MAP = {
  'nginx-proxy-manager': [
    { name: 'port', label: 'Web UI Port', default: '81', replace: (cmd, val) => cmd.replaceAll('81:81', `${val}:81`) },
    { name: 'dir', label: 'Install Directory', default: '/opt/npm', replace: (cmd, val) => cmd.replaceAll('/opt/npm', val) }
  ],
  'portainer': [
    { name: 'port', label: 'HTTPS Port', default: '9443', replace: (cmd, val) => cmd.replaceAll('9443:9443', `${val}:9443`) }
  ],
  'vaultwarden': [
    { name: 'port', label: 'Web UI Port', default: '8080', replace: (cmd, val) => cmd.replaceAll('8080:80', `${val}:80`) }
  ],
  'dockge': [
    { name: 'port', label: 'Web UI Port', default: '5001', replace: (cmd, val) => cmd.replaceAll('5001:5001', `${val}:5001`) }
  ],
  'n8n': [
    { name: 'port', label: 'Web UI Port', default: '5678', replace: (cmd, val) => cmd.replaceAll('5678:5678', `${val}:5678`) }
  ],
  'wg-easy': [
    { name: 'ip', label: 'Server Public IP', default: 'your-public-ip', replace: (cmd, val) => cmd.replaceAll('WG_HOST=your-public-ip', `WG_HOST=${val}`) },
    { name: 'port', label: 'Web UI Port', default: '51821', replace: (cmd, val) => cmd.replaceAll('51821:51821', `${val}:51821`) }
  ],
  'adguard-home': [
    { name: 'port', label: 'Web UI Port', default: '3000', replace: (cmd, val) => cmd.replaceAll('3000:3000', `${val}:3000`) }
  ],
  'umami': [
    { name: 'port', label: 'Web UI Port', default: '3000', replace: (cmd, val) => cmd.replaceAll('3000:3000', `${val}:3000`) }
  ],
  'mariadb': [
    { name: 'password', label: 'Root Password', default: 'change-me', replace: (cmd, val) => cmd.replaceAll('MYSQL_ROOT_PASSWORD=change-me', `MYSQL_ROOT_PASSWORD=${val}`) }
  ],
  'postgresql': [
    { name: 'password', label: 'PostgreSQL Password', default: 'change-me', replace: (cmd, val) => cmd.replaceAll('POSTGRES_PASSWORD=change-me', `POSTGRES_PASSWORD=${val}`) }
  ],
  'phpmyadmin': [
    { name: 'port', label: 'Web UI Port', default: '8080', replace: (cmd, val) => cmd.replaceAll('8080:80', `${val}:80`) }
  ],
  'adminer': [
    { name: 'port', label: 'Web UI Port', default: '8081', replace: (cmd, val) => cmd.replaceAll('8081:80', `${val}:80`) }
  ]
};

let activeConfig = {};

/* ============================================================
   STATE STORAGE MANAGERS
   ============================================================ */
const BookmarksManager = {
  get() {
    try { return JSON.parse(localStorage.getItem('vps_hub_bookmarks') || '[]'); } catch { return []; }
  },
  toggle(slug) {
    const list = this.get();
    const idx = list.indexOf(slug);
    if (idx > -1) {
      list.splice(idx, 1);
      showToast('Removed from favorites');
    } else {
      list.push(slug);
      showToast('Added to favorites');
    }
    localStorage.setItem('vps_hub_bookmarks', JSON.stringify(list));
    return idx === -1;
  },
  isBookmarked(slug) {
    return this.get().includes(slug);
  }
};

const CustomToolsManager = {
  get() {
    try { return JSON.parse(localStorage.getItem('vps_hub_custom_tools') || '[]'); } catch { return []; }
  },
  save(tool) {
    const list = this.get();
    const existing = list.findIndex(t => t.slug === tool.slug);
    if (existing > -1) {
      list[existing] = tool;
    } else {
      list.push(tool);
    }
    localStorage.setItem('vps_hub_custom_tools', JSON.stringify(list));
    initToolsList();
  },
  delete(slug) {
    const list = this.get().filter(t => t.slug !== slug);
    localStorage.setItem('vps_hub_custom_tools', JSON.stringify(list));
    initToolsList();
  }
};

let TOOLS = [];
function initToolsList() {
  const custom = CustomToolsManager.get();
  TOOLS = [...DEFAULT_TOOLS, ...custom];
}
initToolsList();

function getTerminalTheme() {
  return localStorage.getItem('vps_hub_terminal_theme') || 'classic';
}
function setTerminalTheme(theme) {
  localStorage.setItem('vps_hub_terminal_theme', theme);
  document.querySelectorAll('.terminal').forEach(t => {
    t.className = `terminal theme-${theme}`;
  });
  document.querySelectorAll('.term-theme-select').forEach(sel => sel.value = theme);
}

/* ============================================================
   ROUTER & NAVIGATION
   ============================================================ */
const app = document.getElementById('app');

function route() {
  const path = location.hash.replace(/^#/, '') || '/';
  closeSearch(); closeAdmin();
  if (document.getElementById('control-center-drawer')) {
    document.getElementById('control-center-drawer').classList.remove('open');
  }

  activeConfig = {};

  if (path === '/' || path === '') renderHome();
  else if (path.startsWith('/tools')) renderTools();
  else if (path === '/categories') renderCategories();
  else if (path === '/quick-install') renderQuickInstall();
  else if (path === '/low-ram') renderLowRam();
  else if (path === '/docs') renderDocs();
  else if (path === '/calculator') renderCalculator();
  else if (path.startsWith('/tool/')) renderTool(path.split('/')[2]);
  else renderHome();

  updateNav(path);
  lucide.createIcons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNav(path) {
  // Update macOS Top Menu Links
  document.querySelectorAll('.mac-menu-item').forEach(a => {
    const r = a.getAttribute('data-route');
    const isActive = (r === path) ||
      (path.startsWith('/tool/') && r === '/tools') ||
      (path.startsWith('/category/') && r === '/categories');
    a.classList.toggle('active', isActive);
  });

  // Update Floating Bottom Dock Links
  document.querySelectorAll('.dock-item').forEach(a => {
    const r = a.getAttribute('data-route');
    if (r) {
      const isActive = (r === path) || (path.startsWith('/tool/') && r === '/tools');
      a.classList.toggle('active', isActive);
    }
  });
}

window.addEventListener('hashchange', route);

/* ============================================================
   UI HELPERS & CONTROLS
   ============================================================ */
function esc(s){return (s||'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);}

function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    if (btn) {
      btn.classList.add('copied');
      const html = btn.innerHTML;
      btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Copied!';
      lucide.createIcons();
      setTimeout(() => { btn.innerHTML = html; btn.classList.remove('copied'); lucide.createIcons(); }, 1800);
    }
    showToast('Copied to clipboard');
  });
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4 text-brand-500"></i> <span>${msg}</span>`;
  lucide.createIcons();
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

function pillClass(d) {
  return d === 'Easy' ? 'pill-easy' : d === 'Medium' ? 'pill-medium' : 'pill-hard';
}

function handleBookmarkToggle(slug, event, reloadFn = null) {
  if (event) event.stopPropagation();
  const added = BookmarksManager.toggle(slug);
  const btn = document.querySelector(`.bmark-${slug}`);
  if (btn) {
    btn.classList.toggle('active', added);
    btn.innerHTML = `<i data-lucide="star" class="w-4 h-4 ${added ? 'fill-yellow-400 text-yellow-400' : ''}"></i>`;
    lucide.createIcons();
  }
  if (reloadFn) reloadFn();
}

function parseAndReplaceCommand(commandText, slug) {
  let cmd = commandText;
  const configMap = VARIABLES_MAP[slug];
  if (configMap) {
    configMap.forEach(v => {
      const val = activeConfig[v.name] !== undefined ? activeConfig[v.name] : v.default;
      cmd = v.replace(cmd, val);
    });
  }
  return cmd;
}

function terminalBlock(code, slug = null) {
  const resolvedCode = slug ? parseAndReplaceCommand(code, slug) : code;
  const safe = esc(resolvedCode);
  const lines = safe.split('\n').map(l => {
    if (l.trim().startsWith('#')) return `<div class="comment">${l}</div>`;
    return `<div><span class="prompt">$</span><span class="cmd">${l}</span></div>`;
  }).join('');

  const currentTheme = getTerminalTheme();

  return `
    <div class="terminal theme-${currentTheme}">
      <div class="terminal-header">
        <div class="mac-dots">
          <span class="mac-dot mac-dot-close"></span>
          <span class="mac-dot mac-dot-min"></span>
          <span class="mac-dot mac-dot-max"></span>
          <span class="ml-2 text-xs text-slate-400 font-mono">bash — root</span>
          <select onchange="setTerminalTheme(this.value)" class="term-theme-select ml-3 bg-transparent text-[10px] text-slate-400 border border-white/10 outline-none rounded px-1 py-0.5 cursor-pointer">
            <option value="classic" ${currentTheme==='classic'?'selected':''}>Classic</option>
            <option value="onedark" ${currentTheme==='onedark'?'selected':''}>One Dark</option>
            <option value="dracula" ${currentTheme==='dracula'?'selected':''}>Dracula</option>
            <option value="matrix" ${currentTheme==='matrix'?'selected':''}>Matrix</option>
          </select>
        </div>
        <button onclick="copyText(this.dataset.code, this)" data-code="${esc(resolvedCode)}" class="copy-btn flex items-center gap-1.5 text-xs text-slate-300 hover:text-brand-400 transition">
          <i data-lucide="copy" class="w-4 h-4"></i> Copy
        </button>
      </div>
      <div class="terminal-body" style="white-space:pre; line-height:1.6;">${lines}</div>
    </div>
  `;
}

function countByCategory(cat) {
  return TOOLS.filter(t => t.category === cat).length;
}

function toolCard(t) {
  const starred = BookmarksManager.isBookmarked(t.slug);
  return `
    <div class="glass glass-hover p-6 group relative flex flex-col justify-between">
      <button onclick="handleBookmarkToggle('${t.slug}', event)" class="bookmark-btn bmark-${t.slug} ${starred ? 'active' : ''}" title="Favorite">
        <i data-lucide="star" class="w-4 h-4 ${starred ? 'fill-yellow-400 text-yellow-400' : ''}"></i>
      </button>

      <div>
        <div class="flex items-center gap-4 mb-4">
          <div class="squircle-icon">${t.icon}</div>
          <div class="min-w-0 flex-1 pr-6">
            <h3 class="font-bold text-lg truncate">${esc(t.name)}</h3>
            <span class="text-xs text-slate-400 font-mono">${esc(t.category)}</span>
          </div>
        </div>
        <p class="text-sm text-slate-300 mb-4 line-clamp-2 leading-relaxed">${esc(t.description)}</p>
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="pill ${pillClass(t.difficulty)}">${esc(t.difficulty)}</span>
          ${t.featured ? '<span class="pill pill-featured">⭐ Featured</span>' : ''}
          ${t.lowRam   ? '<span class="pill text-cyan-300 bg-cyan-500/10 border-cyan-500/30">⚡ Low RAM</span>' : ''}
        </div>
      </div>

      <div>
        <div class="flex items-center gap-2 text-xs text-slate-400 mb-5 font-mono">
          <i data-lucide="cpu" class="w-3.5 h-3.5 text-brand-500"></i><span>~${t.estRam} MB RAM</span>
          <span class="mx-1">•</span>
          <i data-lucide="hard-drive" class="w-3.5 h-3.5 text-purple-400"></i><span>~${t.estDisk} MB</span>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="location.hash='#/tool/${t.slug}'" class="btn-primary text-xs px-4 py-2 flex-1 flex items-center justify-center gap-2">
            <i data-lucide="terminal" class="w-4 h-4"></i> Install Command
          </button>
          <button onclick="location.hash='#/tool/${t.slug}'" class="btn-ghost text-xs px-3 py-2 flex items-center justify-center gap-1 text-slate-300">
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ============================================================
   macOS & iOS INTERACTIVE TOGGLES
   ============================================================ */
function updateClock() {
  const el = document.getElementById('mac-clock');
  if (el) {
    const d = new Date();
    el.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
setInterval(updateClock, 1000);
updateClock();

function toggleControlCenter() {
  const drawer = document.getElementById('control-center-drawer');
  if (drawer) drawer.classList.toggle('open');
}

function setWallpaper(wpClass) {
  document.body.className = `antialiased ${wpClass}`;
  localStorage.setItem('vps_hub_wallpaper', wpClass);
  showToast(`Wallpaper updated`);
}

(function initWallpaper() {
  const savedWp = localStorage.getItem('vps_hub_wallpaper');
  if (savedWp) {
    document.body.className = `antialiased ${savedWp}`;
  }
})();

function toggleTheme() {
  const html = document.documentElement;
  html.classList.toggle('dark');
  const isDark = html.classList.contains('dark');
  localStorage.setItem('vps_hub_theme', isDark ? 'dark' : 'light');
  
  const icon = document.getElementById('theme-icon');
  if (icon) icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  lucide.createIcons();
}

/* ============================================================
   PAGES RENDERING
   ============================================================ */
function renderHome() {
  const featured = TOOLS.filter(t => t.featured).slice(0, 6);
  app.innerHTML = `
    <section class="relative overflow-hidden pt-8 pb-20 page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="flex justify-center mb-6">
        <div class="status-badge">
          <span class="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-pulse"></span>
          <span>iOS 26 & macOS LIQUID GLASS OS | SYSTEM READY</span>
        </div>
      </div>

      <h1 class="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4">
        MAMDOUH <span class="text-gradient">SCRIPTS OS</span>
      </h1>
      <p class="text-slate-300 max-w-2xl mx-auto text-base md:text-lg mb-8 leading-relaxed font-normal">
        Next-generation command hub to discover, configure, and automate server stacks with liquid glass performance.
      </p>

      <!-- Auto Installer Hero Terminal Box -->
      <div class="hero-terminal-box mb-12">
        <div class="mac-window-bar border-b-0 px-0 pb-3">
          <div class="mac-dots">
            <span class="mac-dot mac-dot-close"></span>
            <span class="mac-dot mac-dot-min"></span>
            <span class="mac-dot mac-dot-max"></span>
            <span class="ml-2 text-xs font-mono text-brand-400">&gt;_ Official One-Line Auto Installer</span>
          </div>
          <span class="text-xs text-slate-500 font-mono">bash v5.2</span>
        </div>
        
        <div class="bg-[#040814] border border-white/10 rounded-xl p-4 font-mono text-xs md:text-sm text-slate-200 overflow-x-auto flex justify-between items-center mb-5">
          <span><span class="text-purple-400">root@vps:~#</span> <span class="text-white">curl -fsSL https://scripts.mx-7.fun/install.sh | sudo bash</span></span>
        </div>

        <div class="flex flex-wrap gap-3">
          <button onclick="copyText('curl -fsSL https://scripts.mx-7.fun/install.sh | sudo bash', this)" class="btn-cyan-solid text-xs md:text-sm">
            <i data-lucide="copy" class="w-4 h-4"></i> Copy Command
          </button>
          <a href="#/docs" class="btn-cyan-outline text-xs md:text-sm">
            <i data-lucide="book" class="w-4 h-4"></i> Documentation
          </a>
          <a href="#/tools" class="btn-dark-trans text-xs md:text-sm">
            <i data-lucide="play" class="w-4 h-4"></i> Interactive Simulator
          </a>
          <a href="https://github.com" target="_blank" class="btn-dark-trans text-xs md:text-sm">
            <i data-lucide="file-down" class="w-4 h-4"></i> ZIP Bundle
          </a>
        </div>
      </div>

      <!-- Quick Category Chips -->
      <div class="flex flex-wrap justify-center gap-2 mb-16">
        ${['Docker','Security','Monitoring','Automation','VPN','Databases'].map(c => `
          <button onclick="location.hash='#/tools?filter=${encodeURIComponent(c)}'" class="btn-ghost text-xs px-4 py-2 hover:border-brand-400 text-slate-200">
            ${c}
          </button>
        `).join('')}
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-20">
        ${[
          { n: TOOLS.length, l: 'Total Tools', i: 'package' },
          { n: CATEGORIES.length, l: 'Categories', i: 'grid' },
          { n: TOOLS.filter(t=>t.lowRam).length, l: 'Low RAM Friendly', i: 'zap' },
          { n: BookmarksManager.get().length, l: 'Your Favorites', i: 'star' }
        ].map(s => `
          <div class="glass p-5 rounded-2xl text-center">
            <div class="w-10 h-10 mx-auto mb-2 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <i data-lucide="${s.i}" class="w-5 h-5 text-brand-400"></i>
            </div>
            <div class="text-3xl font-extrabold text-white">${s.n}</div>
            <div class="text-xs text-slate-400 mt-1">${s.l}</div>
          </div>
        `).join('')}
      </div>

      <!-- Featured Tools -->
      <div class="text-left mb-12">
        <div class="flex justify-between items-end mb-6">
          <div>
            <h2 class="text-3xl font-bold">Featured <span class="text-gradient">Tools</span></h2>
            <p class="text-slate-400 text-sm mt-1">Hand-picked high-performance server tools.</p>
          </div>
          <a href="#/tools" class="btn-ghost text-xs px-4 py-2 flex items-center gap-2">View All <i data-lucide="arrow-right" class="w-4 h-4"></i></a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${featured.map(toolCard).join('')}
        </div>
      </div>

      <!-- Browse Categories -->
      <div class="text-left mb-16">
        <h2 class="text-3xl font-bold mb-6">Browse <span class="text-gradient">Categories</span></h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          ${CATEGORIES.map(c => `
            <a href="#/tools?cat=${encodeURIComponent(c.name)}" class="glass glass-hover p-5 text-center transition-all group">
              <div class="squircle-icon mx-auto mb-3 bg-gradient-to-br ${c.color}">${c.emoji}</div>
              <h3 class="font-bold text-sm text-white mb-1 group-hover:text-brand-400">${c.name}</h3>
              <p class="text-xs text-slate-400">${countByCategory(c.name)} tools</p>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderTools() {
  const urlParams = new URLSearchParams(location.hash.split('?')[1] || '');
  const catParam = urlParams.get('cat') || '';
  const filterParam = urlParams.get('filter') || '';

  app.innerHTML = `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page">
      <div class="mb-8">
        <h1 class="text-3xl md:text-5xl font-extrabold">All <span class="text-gradient">Server Tools</span></h1>
        <p class="text-slate-400 mt-2">Filter and manage ${TOOLS.length} automated Linux deployment scripts.</p>
      </div>

      <div class="glass p-5 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div class="relative flex-1 w-full">
          <i data-lucide="search" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input id="tools-search-input" type="text" placeholder="Search by name, description, command..." class="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-brand-400 transition" oninput="filterToolsPage()">
        </div>
        
        <div class="flex flex-wrap gap-2 w-full md:w-auto">
          <select id="tools-cat-select" onchange="filterToolsPage()" class="bg-white/5 border border-white/10 text-xs text-slate-300 rounded-xl px-3 py-2.5 outline-none font-medium">
            <option value="" class="bg-[#0f172a]">All Categories</option>
            ${CATEGORIES.map(c => `<option value="${c.name}" ${c.name===catParam?'selected':''} class="bg-[#0f172a]">${c.name}</option>`).join('')}
          </select>
          <select id="tools-ram-select" onchange="filterToolsPage()" class="bg-white/5 border border-white/10 text-xs text-slate-300 rounded-xl px-3 py-2.5 outline-none font-medium">
            <option value="" class="bg-[#0f172a]">RAM Requirement</option>
            <option value="512" class="bg-[#0f172a]">&lt;= 512 MB</option>
            <option value="1024" class="bg-[#0f172a]">&lt;= 1 GB</option>
          </select>
        </div>
      </div>

      <div id="tools-grid-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"></div>
    </section>
  `;
  filterToolsPage(filterParam);
}

function filterToolsPage(initialFilter = '') {
  const container = document.getElementById('tools-grid-container');
  if (!container) return;

  const searchInput = document.getElementById('tools-search-input');
  const catSelect = document.getElementById('tools-cat-select');
  const ramSelect = document.getElementById('tools-ram-select');

  const q = (searchInput ? searchInput.value : '').toLowerCase().trim();
  const selectedCat = catSelect ? catSelect.value : '';
  const selectedRam = ramSelect && ramSelect.value ? parseInt(ramSelect.value) : null;
  const filterTag = initialFilter.toLowerCase();

  const filtered = TOOLS.filter(t => {
    const matchesSearch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
    const matchesCat = !selectedCat || t.category === selectedCat;
    const matchesRam = !selectedRam || t.minRam <= selectedRam;
    const matchesFilter = !filterTag || t.category.toLowerCase().includes(filterTag) || t.name.toLowerCase().includes(filterTag);
    return matchesSearch && matchesCat && matchesRam && matchesFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full glass p-12 text-center rounded-2xl">
        <i data-lucide="package-search" class="w-12 h-12 text-slate-500 mx-auto mb-3"></i>
        <h3 class="font-bold text-lg text-white">No tools found</h3>
        <p class="text-xs text-slate-400 mt-1">Try adjusting your filters or search keywords.</p>
      </div>
    `;
  } else {
    container.innerHTML = filtered.map(toolCard).join('');
  }
  lucide.createIcons();
}

function renderCategories() {
  app.innerHTML = `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page">
      <div class="mb-8">
        <h1 class="text-3xl md:text-5xl font-extrabold">Tool <span class="text-gradient">Categories</span></h1>
        <p class="text-slate-400 mt-2">Organized tool suites for web hosts, sysadmins, and cloud developers.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${CATEGORIES.map(c => {
          const catTools = TOOLS.filter(t => t.category === c.name);
          return `
            <div class="glass p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-4 mb-4">
                  <div class="squircle-icon bg-gradient-to-br ${c.color}">${c.emoji}</div>
                  <div>
                    <h3 class="font-bold text-xl text-white">${c.name}</h3>
                    <p class="text-xs text-slate-400 font-mono">${catTools.length} Tools Available</p>
                  </div>
                </div>
                <div class="space-y-2 mb-6">
                  ${catTools.slice(0, 4).map(t => `
                    <a href="#/tool/${t.slug}" class="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 text-sm transition">
                      <span class="flex items-center gap-2 text-slate-200"><span>${t.icon}</span> ${esc(t.name)}</span>
                      <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-500"></i>
                    </a>
                  `).join('')}
                </div>
              </div>
              <a href="#/tools?cat=${encodeURIComponent(c.name)}" class="btn-primary text-xs w-full py-2.5 text-center flex items-center justify-center gap-2">
                Explore Category <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </a>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderQuickInstall() {
  app.innerHTML = `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page">
      <div class="mb-8">
        <h1 class="text-3xl md:text-5xl font-extrabold">Quick <span class="text-gradient">Installers</span></h1>
        <p class="text-slate-400 mt-2">Deploy full engine stacks with a single bash command.</p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        ${QUICK_INSTALLS.map(q => `
          <div class="glass p-6 rounded-3xl">
            <div class="mac-window-bar border-b-0 px-0 pb-3">
              <div class="mac-dots">
                <span class="mac-dot mac-dot-close"></span>
                <span class="mac-dot mac-dot-min"></span>
                <span class="mac-dot mac-dot-max"></span>
                <span class="ml-2 font-bold text-sm text-white">${q.title}</span>
              </div>
              <button onclick="copyText(${JSON.stringify(q.cmd)}, this)" class="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5">
                <i data-lucide="copy" class="w-4 h-4"></i> Copy
              </button>
            </div>
            <pre class="bg-[#040714] border border-white/10 p-4 rounded-xl font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre-wrap"><code>${esc(q.cmd)}</code></pre>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderLowRam() {
  const lowRamTools = TOOLS.filter(t => t.lowRam);
  app.innerHTML = `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page">
      <div class="mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
          <i data-lucide="zap" class="w-3.5 h-3.5"></i> Optimized for 512MB / 1GB VPS
        </div>
        <h1 class="text-3xl md:text-5xl font-extrabold">Low RAM <span class="text-gradient">Suites</span></h1>
        <p class="text-slate-400 mt-2">${lowRamTools.length} lightweight scripts running under 256MB RAM.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${lowRamTools.map(toolCard).join('')}
      </div>
    </section>
  `;
}

function renderCalculator() {
  app.innerHTML = `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page">
      <div class="mb-8">
        <h1 class="text-3xl md:text-5xl font-extrabold">VPS Resource <span class="text-gradient">Calculator</span></h1>
        <p class="text-slate-400 mt-2">Select your desired server tools to estimate combined RAM, Disk space, and recommended VPS tier.</p>
      </div>

      <div class="grid lg:grid-cols-[1.5fr_1fr] gap-8">
        <div class="glass p-6 rounded-3xl space-y-4">
          <h3 class="font-bold text-lg text-white mb-2">Select Tools to Estimate</h3>
          <div class="grid sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
            ${TOOLS.map(t => `
              <label class="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-400 cursor-pointer transition">
                <div class="flex items-center gap-3 min-w-0">
                  <input type="checkbox" class="calc-check w-4 h-4 accent-brand-500 rounded" data-ram="${t.estRam}" data-disk="${t.estDisk}" onchange="recalculateVPS()">
                  <span class="text-xl">${t.icon}</span>
                  <div class="min-w-0">
                    <div class="font-bold text-xs text-white truncate">${esc(t.name)}</div>
                    <div class="text-[10px] text-slate-400 font-mono">RAM: ~${t.estRam}MB</div>
                  </div>
                </div>
              </label>
            `).join('')}
          </div>
        </div>

        <div class="glass p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div class="mac-window-bar border-b-0 px-0 pb-4">
              <div class="mac-dots">
                <span class="mac-dot mac-dot-close"></span>
                <span class="mac-dot mac-dot-min"></span>
                <span class="mac-dot mac-dot-max"></span>
              </div>
              <span class="text-xs font-mono text-brand-400">Calculator Specs</span>
            </div>

            <div class="space-y-6 my-4">
              <div>
                <div class="flex justify-between text-sm font-semibold mb-2">
                  <span class="text-slate-400">Total RAM Needed:</span>
                  <span id="calc-ram-val" class="text-brand-400 font-mono">0 MB</span>
                </div>
                <div class="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                  <div id="calc-ram-bar" class="bg-gradient-to-r from-cyan-400 to-purple-500 h-full w-0 transition-all duration-300"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm font-semibold mb-2">
                  <span class="text-slate-400">Estimated Disk Space:</span>
                  <span id="calc-disk-val" class="text-purple-400 font-mono">0 MB</span>
                </div>
                <div class="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                  <div id="calc-disk-bar" class="bg-gradient-to-r from-purple-500 to-rose-500 h-full w-0 transition-all duration-300"></div>
                </div>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div class="text-xs text-slate-400 mb-1">Recommended VPS Tier</div>
              <div id="calc-vps-tier" class="text-xl font-extrabold text-white">512 MB RAM / 1 vCPU</div>
              <p id="calc-vps-desc" class="text-xs text-slate-400 mt-1">Select tools to see estimated VPS tier.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function recalculateVPS() {
  const checks = document.querySelectorAll('.calc-check');
  let totalRam = 0;
  let totalDisk = 0;

  checks.forEach(c => {
    if (c.checked) {
      totalRam += parseInt(c.dataset.ram || 0);
      totalDisk += parseInt(c.dataset.disk || 0);
    }
  });

  const ramVal = document.getElementById('calc-ram-val');
  const diskVal = document.getElementById('calc-disk-val');
  const ramBar = document.getElementById('calc-ram-bar');
  const diskBar = document.getElementById('calc-disk-bar');
  const tierVal = document.getElementById('calc-vps-tier');
  const tierDesc = document.getElementById('calc-vps-desc');

  if (ramVal) ramVal.textContent = `${totalRam} MB`;
  if (diskVal) diskVal.textContent = totalDisk >= 1000 ? `${(totalDisk/1024).toFixed(1)} GB` : `${totalDisk} MB`;
  
  if (ramBar) ramBar.style.width = `${Math.min(100, (totalRam / 4096) * 100)}%`;
  if (diskBar) diskBar.style.width = `${Math.min(100, (totalDisk / 20000) * 100)}%`;

  if (tierVal && tierDesc) {
    if (totalRam <= 450) {
      tierVal.textContent = "512 MB RAM / 1 vCPU";
      tierDesc.textContent = "Perfect for Hetzner CX11 / DigitalOcean 512MB droplet.";
    } else if (totalRam <= 900) {
      tierVal.textContent = "1 GB RAM / 1 vCPU";
      tierDesc.textContent = "Great for low cost cloud VPS ($4-$6/mo).";
    } else if (totalRam <= 1800) {
      tierVal.textContent = "2 GB RAM / 2 vCPU";
      tierDesc.textContent = "Standard multi-app stack specification.";
    } else {
      tierVal.textContent = "4 GB+ RAM / 2+ vCPU";
      tierDesc.textContent = "High performance web panel & database stack.";
    }
  }
}

function renderDocs() {
  app.innerHTML = `
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page">
      <div class="mb-8">
        <h1 class="text-3xl md:text-5xl font-extrabold">Documentation & <span class="text-gradient">Guides</span></h1>
        <p class="text-slate-400 mt-2">Complete system administration guide for Linux servers.</p>
      </div>

      <div class="space-y-6">
        <div class="glass p-6 rounded-3xl">
          <div class="mac-window-bar border-b-0 px-0 pb-3">
            <div class="mac-dots">
              <span class="mac-dot mac-dot-close"></span>
              <span class="mac-dot mac-dot-min"></span>
              <span class="mac-dot mac-dot-max"></span>
              <span class="ml-2 font-bold text-white">1. Server Prerequisites</span>
            </div>
          </div>
          <p class="text-sm text-slate-300 leading-relaxed mb-3">Ensure your Linux server runs Ubuntu 20.04/22.04/24.04 LTS or Debian 11/12 with root privileges.</p>
          ${terminalBlock('sudo apt update && sudo apt upgrade -y')}
        </div>

        <div class="glass p-6 rounded-3xl">
          <div class="mac-window-bar border-b-0 px-0 pb-3">
            <div class="mac-dots">
              <span class="mac-dot mac-dot-close"></span>
              <span class="mac-dot mac-dot-min"></span>
              <span class="mac-dot mac-dot-max"></span>
              <span class="ml-2 font-bold text-white">2. Firewall & Security Setup</span>
            </div>
          </div>
          <p class="text-sm text-slate-300 leading-relaxed mb-3">Always configure basic UFW firewall rules before opening web interface ports.</p>
          ${terminalBlock('sudo ufw allow 22/tcp\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\nsudo ufw enable')}
        </div>
      </div>
    </section>
  `;
}

function renderTool(slug) {
  const tool = TOOLS.find(t => t.slug === slug);
  if (!tool) { renderHome(); return; }

  app.innerHTML = `
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page">
      <a href="#/tools" class="btn-ghost text-xs px-3 py-1.5 inline-flex items-center gap-1.5 mb-6">
        <i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Tools
      </a>

      <div class="glass p-8 rounded-3xl mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-4">
            <div class="squircle-icon text-3xl">${tool.icon}</div>
            <div>
              <h1 class="text-3xl font-extrabold text-white">${esc(tool.name)}</h1>
              <span class="text-xs text-slate-400 font-mono">${esc(tool.category)}</span>
            </div>
          </div>
          <a href="${tool.website}" target="_blank" class="btn-cyan-outline text-xs py-2 px-4 inline-flex items-center gap-2">
            Official Website <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          </a>
        </div>
        <p class="text-slate-300 text-base leading-relaxed mb-6">${esc(tool.description)}</p>

        <!-- Dynamic Configurator Variables -->
        ${VARIABLES_MAP[slug] ? `
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
            <h4 class="font-bold text-xs text-brand-400 mb-3 flex items-center gap-1.5">
              <i data-lucide="sliders" class="w-4 h-4"></i> Custom Command Configurator
            </h4>
            <div class="grid sm:grid-cols-2 gap-3">
              ${VARIABLES_MAP[slug].map(v => `
                <div>
                  <label class="block text-xs text-slate-400 mb-1">${v.label}</label>
                  <input type="text" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-brand-400" value="${v.default}" oninput="activeConfig['${v.name}']=this.value; route();">
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="mb-6">
          <h3 class="font-bold text-sm text-slate-300 mb-3">Install Command</h3>
          ${terminalBlock(tool.install, slug)}
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-bold text-sm text-slate-300 mb-3">Step-by-Step Guide</h3>
            <ol class="space-y-2 text-xs text-slate-300">
              ${tool.steps.map((s, idx) => `
                <li class="flex items-start gap-2 p-2 rounded-xl bg-white/5">
                  <span class="font-bold text-brand-400">${idx+1}.</span>
                  <span>${esc(s)}</span>
                </li>
              `).join('')}
            </ol>
          </div>
          <div>
            <h3 class="font-bold text-sm text-slate-300 mb-3">System Requirements</h3>
            <ul class="space-y-2 text-xs text-slate-300">
              ${tool.requirements.map(r => `
                <li class="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                  <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i>
                  <span>${esc(r)}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ============================================================
   SPOTLIGHT SEARCH & ADMIN MODALS
   ============================================================ */
function openSearch() {
  const modal = document.getElementById('search-modal');
  if (modal) {
    modal.classList.add('open');
    const input = document.getElementById('search-input');
    if (input) { input.value = ''; input.focus(); }
    liveSearch('');
  }
}
function closeSearch() {
  const modal = document.getElementById('search-modal');
  if (modal) modal.classList.remove('open');
}

function liveSearch(q) {
  const container = document.getElementById('search-results');
  if (!container) return;
  const query = q.toLowerCase().trim();

  const results = TOOLS.filter(t => !query || t.name.toLowerCase().includes(query) || t.category.toLowerCase().includes(query) || t.description.toLowerCase().includes(query));

  if (results.length === 0) {
    container.innerHTML = `<div class="p-6 text-center text-xs text-slate-400">No matching tools found.</div>`;
  } else {
    container.innerHTML = results.slice(0, 8).map(t => `
      <a href="#/tool/${t.slug}" onclick="closeSearch()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition">
        <span class="text-2xl">${t.icon}</span>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-sm text-white truncate">${esc(t.name)}</div>
          <div class="text-xs text-slate-400 truncate">${esc(t.description)}</div>
        </div>
        <span class="pill text-[10px]">${esc(t.category)}</span>
      </a>
    `).join('');
  }
  lucide.createIcons();
}

function openAdmin() {
  const modal = document.getElementById('admin-modal');
  if (modal) {
    renderAdmin();
    modal.classList.add('open');
  }
}
function closeAdmin() {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.classList.remove('open');
}

function renderAdmin() {
  const container = document.getElementById('admin-content');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-6">
      <div class="glass p-5 rounded-2xl">
        <h3 class="font-bold text-base text-white mb-3 flex items-center gap-2">
          <i data-lucide="plus-circle" class="w-5 h-5 text-brand-400"></i> Add Custom Tool Shortcut
        </h3>
        <form onsubmit="handleAdminSubmit(event)" class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-400 mb-1">Tool Name</label>
              <input id="add-name" required type="text" placeholder="e.g. My Custom Script" class="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-white outline-none">
            </div>
            <div>
              <label class="block text-slate-400 mb-1">Slug (URL)</label>
              <input id="add-slug" required type="text" placeholder="my-script" class="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-white outline-none">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-400 mb-1">Emoji Icon</label>
              <input id="add-icon" required type="text" placeholder="🚀" class="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-white outline-none">
            </div>
            <div>
              <label class="block text-slate-400 mb-1">Category</label>
              <select id="add-category" class="w-full bg-[#0f172a] border border-white/10 rounded-xl p-2 text-white outline-none">
                ${CATEGORIES.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div>
            <label class="block text-slate-400 mb-1">Description</label>
            <input id="add-desc" required type="text" placeholder="Brief summary of tool" class="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-white outline-none">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">Install Command</label>
            <textarea id="add-install" required placeholder="curl -fsSL https://..." class="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-white font-mono outline-none h-16"></textarea>
          </div>
          <button type="submit" class="btn-primary w-full py-2.5 rounded-xl font-bold">Save Custom Tool</button>
        </form>
      </div>

      <div class="glass p-5 rounded-2xl max-h-[300px] overflow-y-auto">
        <h4 class="font-bold text-sm text-white mb-3">All Active Tools (${TOOLS.length})</h4>
        <div class="space-y-2">
          ${TOOLS.map(t => {
            const isCustom = CustomToolsManager.get().some(x => x.slug === t.slug);
            return `
              <div class="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs">
                <span class="flex items-center gap-2 text-white"><span>${t.icon}</span> ${t.name}</span>
                ${isCustom ? `
                  <button onclick="handleAdminDelete('${t.slug}')" class="text-rose-400 hover:text-rose-300 p-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                ` : `<span class="text-[10px] text-slate-500 font-mono">System Default</span>`}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function handleAdminSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('add-name').value;
  const slug = document.getElementById('add-slug').value.trim().toLowerCase().replaceAll(' ', '-');
  const icon = document.getElementById('add-icon').value;
  const category = document.getElementById('add-category').value;
  const desc = document.getElementById('add-desc').value;
  const install = document.getElementById('add-install').value;

  const newTool = {
    slug, name, icon, description: desc, category, difficulty: 'Easy',
    os: 'Ubuntu 20.04+', docker: install.includes('docker'), minRam: 256, estRam: 150, estDisk: 200,
    featured: false, lowRam: true, website: 'https://google.com', install,
    steps: ['Execute install script on your Linux terminal.'],
    requirements: ['Root or sudo console access'], useful: [], related: []
  };

  CustomToolsManager.save(newTool);
  showToast(`Tool '${name}' saved!`);
  closeAdmin();
  route();
}

function handleAdminDelete(slug) {
  if (confirm('Delete this tool shortcut?')) {
    CustomToolsManager.delete(slug);
    showToast('Tool deleted');
    renderAdmin();
  }
}

/* Keyboard Listener */
window.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openSearch();
  }
  if (e.key === 'Escape') {
    closeSearch();
    closeAdmin();
    if (document.getElementById('control-center-drawer')) {
      document.getElementById('control-center-drawer').classList.remove('open');
    }
  }
});

/* ============================================================
   CANVAS CONSTELLATION BACKDROP
   ============================================================ */
function initConstellation() {
  const canvas = document.getElementById('constellation-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  const particles = [];
  const maxParticles = Math.min(60, Math.floor((width * height) / 20000));
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.fill();
    }
  }
  
  for (let i = 0; i < maxParticles; i++) particles.push(new Particle());
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

/* BOOTLOADER */
lucide.createIcons();
route();
initConstellation();
