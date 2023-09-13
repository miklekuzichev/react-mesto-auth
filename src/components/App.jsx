import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import AddPlacePopup from './AddPlacePopup';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import api from '../utils/api.js';
import { CurrentUserContext } from '../context/CurrentUserContext.js';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';


import * as auth from '../utils/auth';


function App() {

    const [selectedCard, setSelectedCard] = React.useState({});
    //const [name, setName] = React.useState('');
    const [loggedIn, setLoggedIn] = React.useState(false);
    
    
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);

    const [currentUser, setCurrentUser] = React.useState({}); // default value
    const [cards, setCards] = React.useState([]);

    const [isRenderLoading, setIsRenderLoading] = React.useState(false);

    const [authorizationEmail, setAuthorizationEmail] = useState('');
    const navigate = useNavigate();

    console.log('loggedIn ', loggedIn);
    
    
  React.useEffect(() => {
    //
    // Загрузка готовых карточек и данных о пользователе с сервера
    //
        Promise.all([api.getInitialCards(), api.getUserInfo()])
        .then(([cards, userData]) => {
            setCurrentUser(userData);
            setCards(cards);
        })
        .catch(console.error);

   }, []);

    const handleCardClick = (card) => {
        setSelectedCard(card);
    };

    function renderLoading() {
      setIsRenderLoading((isRenderLoading) => !isRenderLoading);
    };


    function handleCardLike(card) {
      const isLiked = card.likes.some(i => i._id === currentUser._id); // Проверяем, есть ли уже лайк на этой карточке
      // Отправляем запрос в API и получаем обновлённые данные карточки
      if(isLiked) {
        api.deleteLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((item) => item._id === card._id ? newCard : item));
        })
        .catch(console.error);
      }
      else {
        api.makeLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((item) => item._id === card._id ? newCard : item));
        })
        .catch(console.error);
      }  
  } 

    function handleCardDelete(card) {
      // Отправляем запрос в API и получаем обновлённые данные карточки
      api.deleteCard(card._id)
      .then(() => {
          setCards((cards) => cards.filter((item) => item._id !== card));
      })
      .catch(console.error)
//    .finally(() => renderLoading())
    } 

    function handleAddPlaceSubmit (card) {
      renderLoading();
      // Отправляем запрос в API
      api.addCard(card)
      .then((card) => {
        setCards([card, ...cards]);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => renderLoading())
    } 


    const handleEditAvatarClick = () => {
        setIsEditAvatarPopupOpen(true);
    };

    const handleEditProfileClick = () => {
        setIsEditProfilePopupOpen(true);
    };

    const handleAddPlaceClick = () => {
        setIsAddPlacePopupOpen(true);
    };

    const closeAllPopups = () => {
        setSelectedCard({});
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setIsInfoTooltipOpen(false);
    };

    function handleUpdateUser(userData) {
      renderLoading();
      api.editUserInfo(userData) 
        .then((data) => {
          setCurrentUser(data);
          closeAllPopups();
        })
        .catch(console.error)
        .finally(() => renderLoading())
    };
    
    function handleUpdateAvatar(userAvatar) {
      renderLoading();
      api.editAvatar(userAvatar)
        .then((data) => {
          setCurrentUser(data);
          closeAllPopups();
        })
        .catch(console.error)
        .finally(() => renderLoading())
    };


    const openInfoTooltip = () => {
      setIsInfoTooltipOpen(true);
    };

    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
    const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState(false);



    // Регистрация и Авторизация профиля
  const handleRegistration = (data) => {
    return auth
      .register(data)
      .then((data) => {
        setIsRegistrationSuccessful(true);
        openInfoTooltip();
        navigate('/sign-in');
      })
      .catch((err) => {
        console.log(err);
        setIsRegistrationSuccessful(false);
        openInfoTooltip();
      });
  };

  const handleAuthorization = (data) => {
    return auth
      .authorize(data)
      .then((data) => {
        setLoggedIn(true);
        localStorage.setItem('jwt', data.token);
        handleTokenCheck();
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltip();
      });
  };

  // Выход
  const handleSignOut = () => {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    navigate('/sign-in');
  };

  // Проверка токена
  const handleTokenCheck = () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      return;
    }
    auth
      .getContent(jwt)
      .then((data) => {
        console.log('authorizationEmail ', data.data.email);
        setAuthorizationEmail(data.data.email);
        setLoggedIn(true);
        navigate('/');
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    handleTokenCheck();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      navigate('/');
    }
  }, [loggedIn]);



  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
          <Header 
          loggedIn={loggedIn}
          userEmail={authorizationEmail}
          onSignOut={handleSignOut}
          />
          <Routes>
            <Route path="/sign-in" element={<Login onLogin={handleAuthorization} />} />
            <Route path="/sign-up" element={<Register onRegister={handleRegistration} />} />  
            <Route path="/" 
              element={<ProtectedRoute
              element={Main}
              loggedIn={loggedIn}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardDelete={handleCardDelete}
              cards={cards}
              onCardLike={handleCardLike}
            />}
            />
          </Routes>

          <Footer />
          <ImagePopup 
          card={selectedCard}
          onClose={closeAllPopups}
          />

          <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            name={'type_add'}
            onAddPlace={handleAddPlaceSubmit}
            isRenderLoading={isRenderLoading}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            name={'edit-profile'}
            isRenderLoading={isRenderLoading}
          />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            name={'type_edit'}
            onUpdateUser={handleUpdateUser}
            isRenderLoading={isRenderLoading}
          />

          <InfoTooltip
            onClose={closeAllPopups}
            isOpen={isInfoTooltipOpen}
            isSuccess={isRegistrationSuccessful}
          />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
