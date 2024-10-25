// import React from 'react';
// import { useTheme } from '../../contexts/ThemeContext';
// import './Button.module.css';

// interface ButtonProps {
//   children: React.ReactNode;
//   onClick?: () => void;
// }

// export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
//   const { theme } = useTheme();

//   return (
//     <button
//       onClick={onClick}
//       className={`button ${
//         theme.mode === 'dark' ? 'button-dark' : 'button-light'
//       }`}>
//       {children}
//     </button>
//   );
// };
