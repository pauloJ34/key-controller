import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 25rem;
  min-width: 22.5rem;
  gap: 1rem;

  background-color: ${({ theme }) => theme['white-0']};
  padding: 1rem;
  border-radius: 0.5rem;
  transform: translateX(-50%) translateY(-50%);
  z-index: 1000;

  .modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .modal__content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;
