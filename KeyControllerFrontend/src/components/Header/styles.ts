import styled from 'styled-components';

export const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .header__search {
    display: flex;
    align-items: center;
    width: 16rem;
    gap: 1rem;

    padding: 0.75rem 1rem;
    border: thin solid ${({ theme }) => theme['white-150']};
    border-radius: 0.5rem;
  }

  .header__search > .material__symbol {
    font-size: 1.5rem;
  }

  .header__search > input {
    border: none;
    outline: none;
  }

  .header__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .header__actions > .header__action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;

    background-color: ${({ theme }) => theme['black-850']};
    border-radius: 0.5rem;
  }

  .header__actions > .header__action > .material__symbol {
    color: ${({ theme }) => theme['white-0']};
  }
`;
