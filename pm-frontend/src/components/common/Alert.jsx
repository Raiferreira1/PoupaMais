import PropTypes from 'prop-types';
import { COLORS } from '../../utils/colors';

const Alert = ({ message, type = 'success', onClose }) => {
  const bgColor = type === 'success' ? COLORS.success.light + '20' : COLORS.danger.light + '20';
  const textColor = type === 'success' ? COLORS.success.DEFAULT : COLORS.danger.DEFAULT;
  const borderColor = type === 'success' ? COLORS.success.light : COLORS.danger.light;

  return (
    <div
      className="px-4 py-3 rounded relative mb-4"
      role="alert"
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        color: textColor,
      }}
    >
      <span className="block sm:inline">{message}</span>
      <button
        onClick={onClose}
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
      >
        <svg
          className="fill-current h-6 w-6"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          style={{ color: textColor }}
        >
          <title>Fechar</title>
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
        </svg>
      </button>
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error']),
  onClose: PropTypes.func.isRequired,
};

export default Alert; 