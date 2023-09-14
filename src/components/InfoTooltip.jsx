import unsuccessImg from '../images/unsuccess.svg';
import successImg from '../images/success.svg';

const InfoTooltip = ({ isSuccess, isOpen, onClose }) => {
  return (

    <div className={`popup ${isOpen ? 'popup_opened' : ""}`}>
      <div className="popup__container-tooltip">
        <button type="button" className="popup__close" onClick={onClose} />
        <img className="popup__signup-icon"
          src={isSuccess 
            ? successImg 
            : unsuccessImg}
          alt={isSuccess 
                ? 'Вы успешно зарегистрировались!' 
                : 'Что-то пошло не так! Попробуйте ещё раз.'
              }
        />
        <h2 className="popup__signup-title">
          {isSuccess
            ? 'Вы успешно зарегистрировались!'
            : 'Что-то пошло не так! Попробуйте ещё раз.'
          }
        </h2>
      </div>
    </div>

  );
};

export default InfoTooltip;
