# Papyrus Wallet

### Build docker "hard-way"
```
docker-compose up
```
#### Lazy-way
```
docker build https://github.com/papyrusglobal/wallet.git -t wallet && docker run -p 8380:80 -d wallet
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

### Development
```
yarn install
yarn run dev
```
