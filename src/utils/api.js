//
// Класс взаимодействия с сервером
//
class Api {
    constructor(options) {
      this._baseUrl = options.baseUrl;
      this._headers = options.headers;
    }
//
// Метод проверки ответа сервера
//
   _checkResponse(res) {
    if(res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }
//
// Метод проверки ответа сервера
//
  _request(url, options) {
    return fetch(`${this._baseUrl}/${url}`, options)
      .then(this._checkResponse)
  } 
//
// Метод получения картинок с сервера
//
  getInitialCards() {
    return this._request('cards', { headers: this._headers });
}
//
// Метод изменения аватара пользователя
//  
  editAvatar(data) {
    return this._request('users/me/avatar', 
      { method: 'PATCH',
        headers: this._headers,
        body: JSON.stringify(
          {avatar: data.imagelink
          }) 
      });
}
//
// Метод получения информации о пользователе
//
  getUserInfo() {
    return this._request('users/me', 
      { headers: this._headers,
      });
  }
 //
 // Метод загрузки новой карточки на сервер
 //   
  addCard(data) {
    return this._request('cards', 
    { method: 'POST',
      headers: this._headers,
      body: JSON.stringify(
        {name: data.imageName,
          link: data.imageLink
        }) 
    });
  }
//
// Метод Изменения информации о пользователе
//
  editUserInfo(data) {
    return this._request('users/me', 
    { method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(
        {name: data.name,
          about: data.about
        })
    });
  }
//
// Метод удаления карточки с сервера
//
  deleteCard(cardId) {
    return this._request(`cards/${cardId}`, 
    { method: 'DELETE',
      headers: this._headers
    });
  } 
//
// Метод установки лайка
//
  makeLike(cardId) {
    return this._request(`cards/${cardId}/likes`, 
    { method: 'PUT',
      headers: this._headers
    });
  } 
//
// Метод удаления лайка
//
  deleteLike(cardId) {
    return this._request(`cards/${cardId}/likes`, 
    { method: 'DELETE',
      headers: this._headers
    });
}
}
//
// Создаем экземпляр класса Api
//
const baseUrl = 'https://mesto.nomoreparties.co/v1/cohort-71';
const authorization = '4d9ffc72-560d-4507-8006-e62ea753eb8d';

const api = new Api({
  baseUrl: baseUrl,
  headers: {
      authorization: authorization,
      'Content-Type': 'application/json'
  }
});

export default api;
//
//
//