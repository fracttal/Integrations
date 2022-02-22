const crypto = require("crypto");
const fetch = require("node-fetch");

//API Keys
const idApp = "ID_FRACTTAL";
const secretKey = "SECRET_KEY_FRACTTAL";
const host = "app.fracttal.com";

const makeRandomString = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const createHMACBase64Hash = (data, hashAlg = "sha256") => {
  return crypto.createHmac(hashAlg, secretKey).update(data).digest("base64");
};

const createHMACAuthHeader = (nonce, method, route, host, timespan, port) => {
  const payloadHeader = "hawk.1.header";
  const macString = `${payloadHeader}\n${timespan}\n${nonce}\n${method}\n${route}\n${host}\n${port}\n\n\n`;
  return createHMACBase64Hash(macString);
};


const getAsset = async () => {
  const method = "GET";

  const route = "/api/items_details";
  const timespan = Math.floor(Date.now() / 1000);
  const url = `https://${host}${route}`;
  const nonce = makeRandomString(5); //string 5 characters
  const hmac = createHMACAuthHeader(nonce, method, route, host, timespan, 443);

  var requestOptions = {
    method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Authorization: `Hawk id="${idApp}", ts="${timespan}", nonce="${nonce}", mac="${hmac}"`,
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  };

  const response = await fetch(url, requestOptions);

  const infoResponse = await response.json();
  console.log('response', infoResponse);

};

const createAsset = async() => {
  
  const route = "/api/items";
  const timespan = Math.floor(Date.now() / 1000);
  const method = "POST";
  const url = `https://${host}${route}`;
  const body = {
    id_type_item: 2,
    code: "REF28",
    field_1: "REFRIGERADOR DE VACUNAS",
    field_2: "SAMSUNG",
    field_3: "C13 D",
    field_4: "001827",
    field_5: "02 RACKS",
    field_6: "750X580X390",
    barcode: "123987123AAC",
    is_tool: "false",
    active: "true"
  };

  const nonce = makeRandomString(5);
  const hmac = createHMACAuthHeader(nonce, method, route, host, timespan, 443);

  const requestOptions = {
    method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Authorization: `Hawk id="${idApp}", ts="${timespan}", nonce="${nonce}", mac="${hmac}"`,
    },
    redirect: 'follow', 
    body: JSON.stringify(data),
  };

  const response = await fetch(url, requestOptions);
  const infoResponse = await response.json();
  console.log('response', infoResponse);
};

getAsset();
//createAsset();
