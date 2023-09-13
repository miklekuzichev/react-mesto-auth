import { Link } from "react-router-dom";
import React, { useState } from "react";

//import useForm from '../hooks/useForm';

const Register = (props) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleChangeEmail(evt) {
    setEmail(evt.target.value);
  }
  function handleChangePassword(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onRegister({ email, password });
  }

  //const { enteredValues, errors, handleChange } = useForm();

  //const handleSubmit = (event) => {
  //  event.preventDefault();
  //  onRegister(enteredValues);
  //};

  return (
    <>
      <div className="auth">
        <h2 className="auth__title">Регистрация</h2>
        <form className="auth__form" onSubmit={handleSubmit}>
        <fieldset className="auth__fieldset">
          <input
            className="auth__input"
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={handleChangeEmail}
            required
          />
          <input
            className="auth__input"
            id="password"
            name="password"
            type="password"
            minLength="8"
            placeholder="Пароль"
            autoComplete="password"
            value={password}
            onChange={handleChangePassword}
            required
          />
          </fieldset>
          <button className="auth__submit" type="submit">Зарегистрироваться</button>
        </form>
      <Link to="/sign-in" className="auth__hint">
        Уже зарегистрированы? Войти
      </Link>
      </div>
    </>
  );
};

export default Register;