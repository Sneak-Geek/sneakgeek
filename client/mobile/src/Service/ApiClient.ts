// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import axios from "axios";

export const baseUrl = __DEV__ ? "http://192.168.0.11:8080/api/v1" : "https://sneakgeek-test.azurewebsites.net/api/v1";

const ApiClient = axios.create({
  baseURL: baseUrl,
  timeout: 10000
});

export default ApiClient;
