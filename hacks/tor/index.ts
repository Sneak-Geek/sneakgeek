import tr from 'tor-request';
import { MongoClient } from 'mongodb';

const Constants = {
  BASE_URL: "https://stockx.com/api/browse?productCategory=sneakers",
  USER_AGENT: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.3"
}

tr.TorControlPort.password = process.env.pwd;

function request<T>(config: { method: string; url: string; headers?: any }): Promise<{ res: any, body: T }> {
  return new Promise((resolve, reject) => {
    tr.request({ method: config.method, url: config.url, headers: config.headers }, (err, res, body) => {
      if (err) reject(err);
      else resolve({ res, body });
    });
  });
}

function renew(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    tr.renewTorSession((err, msg) => {
      if (!err) resolve(true);
      else {
        console.error("Error renewing session", err);
      }
    });
  });
}

function getMongoClient(): Promise<MongoClient> {
  return new Promise((resolve, reject) => {
    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
      if (err) reject(err);
      else resolve(client);
    })
  });
}

async function getIP() {
  const { body: ip } = await request({
    method: 'get',
    url: 'https://api.ipify.org',
  });

  return ip;
}

async function main() {
  const ip = await getIP();
  // console.log(ip);
  console.log('Starting IP at', ip);

  // Preparing db
  const client = await getMongoClient();
  const db = client.db('snkgk-hack');

  // Begin hacking
  const { body } = await request({
    method: 'get',
    url: Constants.BASE_URL,
    headers: {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0dd.9,image/webp,*/*;q=0.8",
      "accept-encoding": "gzip,deflate,br",
      "accept-language": "en-US;en;q=0.5",
      "connection": "keep-alive",
      "host": "stockx.com",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0"
    }
  });
  console.log("Brand", body);
}

main();