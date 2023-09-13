//import useForm from '../hooks/useForm';
import React, { useState } from "react";

const Login = (props) => {

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
    props.onLogin({ email, password });
  }
  //const { enteredValues, errors, handleChange } = useForm({});
  //const handleSubmit = (event) => {
  //  event.preventDefault();
  //  if (!enteredValues.email || !enteredValues.password) {
  //    return;
  //  }
  //  onLogin(enteredValues);
  //};

  return (
    <div className="auth">
      <h2 className="auth__title">Вход</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <fieldset className="auth__fieldset">
          <input
            className="auth__input"
            type="email"
            placeholder="Email"
            name="email"
            id="email"
            autoComplete="email"
            value={email || ''}
            onChange={handleChangeEmail}
            required
          />
          <input
            className="auth__input"
            type="password"
            minLength="8"
            name="password"
            id="password"
            placeholder="Пароль"
            autoComplete="password"
            value={password || ''}
            onChange={handleChangePassword}
            required
          />
        </fieldset>
        <button className="auth__submit" type="submit">Войти</button>
        <span className="auth__login-hint"></span>
      </form>
    </div>
  );
};

export default Login;