import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .dropdown__toggle {
    cursor: pointer;
  }

  .dropdown__items {
    display: flex;
    flex-direction: column;
    width: 10rem;
    position: absolute;
    top: 60%;
    right: 60%;

    background-color: ${({ theme }) => theme['white-150']};
    padding: 0.25rem 0;
    border-radius: 0.5rem;
  }

  .dropdown__item {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    padding: 0.25rem 0.5rem;
    transition: background-color 0.2 ease;
  }

  .dropdown__item:hover {
    background-color: ${({ theme }) => theme['white-200']};
  }
`;
