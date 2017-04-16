# Web Push Service

This is a project developed within [NodeSchool Istanbul Webinar](https://www.meetup.com/nodeschool-istanbul/events/239061662/)

## Howto Run

1. Generate VAPID Keys as described [here](https://www.npmjs.com/package/web-push)
2. Put public key inside `public/js/main.js` at 3rd line `let applicationKey = "put_your_public_key_here";`
3. `export VAPID_PRIVATE_KEY=<your_private_key>`
4. `export VAPID_PUBLIC_KEY=<your_public_key>`
5. `export MONGO_URI=<your_mongo_url>`
6. `npm run dev`
7. Go to `http://localhost:5000/index.html` and accept notifications

## Howto Push Message

After subscription, you can use following message to send message

```
curl -X POST \
  http://localhost:5000/push \
  -H 'content-type: application/json' \
  -d '{
	"title": "Hey Noders!",
    "message": "Welcome to NodeSchool Istanbul Webinar",
    "url": "http://nodeschool.ist/",
    "ttl": 36000,
    "icon": "https://cdn3.iconfinder.com/data/icons/happy-x-mas/501/santa15-128.png"
}'
```