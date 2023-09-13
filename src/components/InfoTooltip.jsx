import unsuccessImg from '../images/unsuccess.svg';
import successImg from '../images/success.svg';

const InfoTooltip = ({ isOpen, onClose, isSuccess }) => {
  return (


    <div className={`popup ${isOpen ? 'popup_opened' : ""}`}>
      <div className="popup__container-tooltip">
        <button type="button" className="popup__close" onClick={onClose} />
        <img
          src={isSuccess ? successImg : unsuccessImg}
          alt={isSuccess ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}
          className="popup__signup-icon"
        />
        <h3 className="popup__signup-title">
          {isSuccess
            ? 'Вы успешно зарегистрировались!'
            : 'Что-то пошло не так! Попробуйте ещё раз.'}
        </h3>
      </div>
    </div>
  );
};

export default InfoTooltip;
