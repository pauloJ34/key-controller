import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 1.5rem;

  overflow-y: scroll;

  .form {
    max-width: 25rem;
  }

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;
