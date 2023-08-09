import http from 'k6/http';
import { check, group, sleep, Trend } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export function handleSummary(data) {
  return {
    "summaryStressTest.html": htmlReport(data),
  };
}

export const options = {
  //stress testing
  stages: [
    { duration: '1m', target: 30 }, // simulate ramp-up of traffic from 0 to 500 users over 3 minutes.
    { duration: '4m', target: 30 }, // simulate ramp-up of traffic from 0 to 500 users over 3 minutes.
    { duration: '1m', target: 60 }, // normal load
    { duration: '4m', target: 60 },
    { duration: '1m', target: 90 }, // around the breaking point
    { duration: '4m', target: 90 },
    { duration: '1m', target: 120 }, // beyond the breaking point
    { duration: '4m', target: 120 },
    { duration: '1m', target: 0 }, // ramp-down to 0 users over 10 minutes
  ],
};

export default function (data) {
  group('Criar Usuário', () => {
    let createUserPayload = {
      username: 'testuser',
      password: 'testpassword',
      email: 'testuser@example.com'
    };

    let createUserParams = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let createUserResponse = http.post(
      'https://petstore.swagger.io/v2/user',
      JSON.stringify(createUserPayload),
      createUserParams
    );

    check(createUserResponse, {
      'Create User Status is 200': (r) => r.status === 200
    });

    sleep(randomIntBetween(1, 3)); // Esperar de 1 a 3 segundos entre as requisições
  });

  group('Login', () => {
    let username = 'testuser';
    let password = 'testpassword';

    let loginParams = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        username: username,
        password: password,
      },
    };

    let loginResponse = http.get(
      'https://petstore.swagger.io/v2/user/login',
      loginParams
    );

    check(loginResponse, {
      'Login Status is 200': (r) => r.status === 200
    });

    sleep(randomIntBetween(1, 3)); // Esperar de 1 a 3 segundos entre as requisições
  });

  group('Obter Informações do Usuário', () => {
    let username = 'testuser';
    let getUserParams = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let getUserResponse = http.get(
      `https://petstore.swagger.io/v2/user/${username}`,
      getUserParams
    );

    check(getUserResponse, {
      'Get User Status is 200': (r) => r.status === 200
    });

    sleep(randomIntBetween(1, 3)); // Esperar de 1 a 3 segundos entre as requisições
  });
}