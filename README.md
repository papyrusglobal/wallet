# Papyrus Wallet

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Docker
```
docker build . -t wallet
docker run -d -p --name=papyrus-wallet 8080:80 wallet
```
