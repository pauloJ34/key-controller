import { createGlobalStyle } from 'styled-components';
import theme from './theme';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    background: ${theme['white-0']};
    -webkit-font-smoothing: antialiased;
    font: 400 1rem 'Poppins', sans-serif;
  }

  ::-webkit-scrollbar {
    width: .75rem;
    height: .75rem;
    border-radius: 0.5rem;
  }

  ::-webkit-scrollbar-track {
    background: ${theme['white-150']};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme['white-200']};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme['white-250']};
  }

  button {
    border: none;
    cursor: pointer;
    background: transparent;
  }

  a {
    color: ${theme['white-0']};
    text-decoration: none;
    cursor: pointer;
  }

  .header1 {
    font-size: 3.5rem;
    font-weight: 500;
    line-height: 4rem;
  }

  .header2 {
    font-size: 3rem;
    font-weight: 400;
    line-height: 3.5rem;
  }

  .header3 {
    font-size: 2rem;
    font-weight: 500;
    line-height: 2.5rem;
  }

  .header4 {
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 2rem;
  }

  .text, label, input, button, option {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5rem;
  }

  .details {
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1rem;
  }

  .input__wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: .25rem;
  }

  .input__error > .form__input {
    border: thin solid ${theme['danger-500']};
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: .75rem
  }

  .form__row {
    display: flex;
    width: 100%;
    gap: .25rem
  }

  .form__input {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: solid thin ${theme['white-250']};
    border-radius: 4px;
  }

  .form__button {
    width: 100%;

    color: ${theme['white-0']};
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5rem;

    background-color: ${theme['black-850']};
    margin-top: .5rem;
    padding: .5rem 1rem;
    border-radius: .5rem;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 998;

    background-color: #00000080;
  }
  
  .overlay--closed {
    display: none;
    background-color: transparent;
  }

  .swal2-modal {
    display: flex;
    flex-direction: column;
    width: 25rem;
    gap: .5rem;

    color: ${({ theme }) => theme['black-1000']} !important;
    font-family: 'Poppins', sans-serif;
    
    padding: 1rem;
  }
  
  .swal2-title {
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 2rem;
    text-align: start;

    padding: 0;
  }

  .swal2-close {
    width: 1.5rem;
    height: 1.5rem;
  }

  #swal2-html-container {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5rem;

    margin: 0 !important;
  }

  .swal2-actions {
    gap: .5rem;
    margin-top: 0;
  }

  .swal2-styled {
    margin: 0;
    padding: .5rem 1.5rem;
  }
`;
