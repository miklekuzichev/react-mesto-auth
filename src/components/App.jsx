import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import api from "../utils/api.js";
import { CurrentUserContext } from "../context/CurrentUserContext.js";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import * as auth from "../utils/auth";

function App() {
  const [selectedCard, setSelectedCard] = React.useState({});
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({}); // default value
  const [cards, setCards] = React.useState([]);
  const [isRenderLoading, setIsRenderLoading] = React.useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    //
    // Загрузка готовых карточек и данных о пользователе с сервера
    //
    if (loggedIn) {
      Promise.all([api.getInitialCards(), api.getUserInfo()])
        .then(([cards, userData]) => {
          setCurrentUser(userData);
          setCards(cards);
        })
        .catch(console.error);
    }
  }, [loggedIn]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  function renderLoading() {
    setIsRenderLoading((isRenderLoading) => !isRenderLoading);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id); // Проверяем, есть ли уже лайк на этой карточке
    // Отправляем запрос в API и получаем обновлённые данные карточки
    if (isLiked) {
      api
        .deleteLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((item) => (item._id === card._id ? newCard : item)),
          );
        })
        .catch(console.error);
    } else {
      api
        .makeLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((item) => (item._id === card._id ? newCard : item)),
          );
        })
        .catch(console.error);
    }
  }

  function handleCardDelete(card) {
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((item) => item._id !== card));
      })
      .catch(console.error);
    //    .finally(() => renderLoading())
  }

  function handleAddPlaceSubmit(card) {
    renderLoading();
    // Отправляем запрос в API
    api
      .addCard(card)
      .then((card) => {
        setCards([card, ...cards]);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => renderLoading());
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
    api
      .editUserInfo(userData)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => renderLoading());
  }

  function handleUpdateAvatar(userAvatar) {
    renderLoading();
    api
      .editAvatar(userAvatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch(console.error)
      .finally(() => renderLoading());
  }

  const openInfoTooltip = () => {
    setIsInfoTooltipOpen(true);
  };

  // Авторизация пользователя
  //
  const handleLogin = (data) => {
    return auth
      .login(data)
      .then((res) => {
        setLoggedIn(true);
        setUserEmail(data.email);
        localStorage.setItem("token", res.token);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltip();
      });
  };

  // Регистрация пользователя
  //
  const handleRegistration = (data) => {
    return auth
      .register(data)
      .then(() => {
        setIsRegistration(true);
        openInfoTooltip();
        navigate("/sign-in");
      })
      .catch((err) => {
        console.log(err);
        setIsRegistration(false);
        openInfoTooltip();
      });
  };

  // Проверка токена
  //
  const handleCheckToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    auth
      .getContent(token)
      .then((data) => {
        setLoggedIn(true);
        //console.log('data.email ', data);
        setUserEmail(data.data.email);
        navigate("/");
      })
      .catch(console.error);
  };

  // Разлогинивание юзера
  //
  const handleSignOut = () => {
    setLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/sign-in");
  };

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn]);

  useEffect(() => {
    handleCheckToken();
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          loggedIn={loggedIn}
          userEmail={userEmail}
          onSignOut={handleSignOut}
        />
        <Routes>
          <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/sign-up"
            element={<Register onRegister={handleRegistration} />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Main}
                loggedIn={loggedIn}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardDelete={handleCardDelete}
                cards={cards}
                onCardLike={handleCardLike}
              />
            }
          />
          <Route
            path="/*"
            element={
              loggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
        </Routes>
        <Footer />

        <InfoTooltip
          isSuccess={isRegistration}
          onClose={closeAllPopups}
          isOpen={isInfoTooltipOpen}
          textPopup={isRegistration ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте ещё раз."}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          name={"type_add"}
          onAddPlace={handleAddPlaceSubmit}
          isRenderLoading={isRenderLoading}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          name={"edit-profile"}
          isRenderLoading={isRenderLoading}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          name={"type_edit"}
          onUpdateUser={handleUpdateUser}
          isRenderLoading={isRenderLoading}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
