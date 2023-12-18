import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  right: -100%;
  width: 21rem;
  height: 100vh;
  gap: 0.5rem;

  overflow-y: scroll;

  background-color: ${({ theme }) => theme['white-0']};
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  transition: right 0.3s linear;
  z-index: 1000;

  &.modal--open {
    right: 0;
  }

  .modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal__content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;
