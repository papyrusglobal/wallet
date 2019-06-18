# Papyrus Wallet

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Setup environment
```
echo 'VUE_APP_PAPYRUS_NETWORK_ID={id}' >> .env.local
echo 'VUE_APP_BIOS_ADDRESS={address}' >> .env.local
```
or
```
cat .env > .env.local
```
and change it

### Compiles and minifies for production
```
yarn run build
```

### Docker
```
docker-compose up
```
