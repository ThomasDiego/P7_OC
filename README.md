
## BACKEND
1) Préparation:
```bash
  cd BACK
```
2) Renommer .env.exemple en .env et le configurer
```bash
JWT_SECRET=""
MYSQL_HOST=""
MYSQL_USERNAME=""
MYSQL_PASSWORD=""
MYSQL_DB=""
```
3) Importer base de données MySQL : db.sql

4) Installation et lancement:
```bash
  npm install
  nodemon server.js
```
## FRONTEND
1) Préparation:
```bash
  cd FRONT
```
2) Renommer .env.exemple en .env et le configurer
```bash
VUE_APP_API_URL=""
```
3) Installation et lancement:
```bash
  npm install
  npm run serve
```