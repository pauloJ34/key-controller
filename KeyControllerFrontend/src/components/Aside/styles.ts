import styled from 'styled-components';

export const Container = styled.aside`
  display: flex;
  flex-direction: column;
  width: 16rem;
  min-width: 16rem;
  height: 100%;

  background-color: ${({ theme }) => theme['black-850']};
  padding: 1.5rem 1rem;
  border-radius: 0.5rem;

  .aside__logo {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .aside__nav {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    margin-top: 2.5rem;
  }

  .aside__link {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    color: ${({ theme }) => theme['white-0']};

    transition: opacity 0.2s ease-in-out;
  }

  .aside__link:is(:hover, :focus) {
    opacity: 0.8;
  }

  .aside__logout {
    margin-top: auto;
  }
`;
