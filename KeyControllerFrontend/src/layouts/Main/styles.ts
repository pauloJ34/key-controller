import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;

  overflow: hidden;

  background-color: ${({ theme }) => theme['white-150']};

  & > .container__content {
    display: flex;
    position: relative;
    width: 100%;
    max-width: 100rem;
    height: 100vh;
    gap: 1rem;

    padding: 1rem;
  }

  & > .container__content > .content__inner {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: 0.75rem;

    overflow: hidden;

    background-color: ${({ theme }) => theme['white-0']};
    padding: 0.75rem;
    border-radius: 0.5rem;
  }
`;
