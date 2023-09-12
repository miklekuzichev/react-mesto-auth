
export const BASE_URL = ' https://auth.nomoreparties.co';

/**Обработать ответ*/
function handleReply(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

export function register(data) {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers ,
    body: JSON.stringify(data)
  })
    .then(handleReply)
}

export function authorize(data) {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  })
    .then(handleReply)
};

/**Запрос токена*/
export function getContent (token) {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
    .then(handleReply)
}