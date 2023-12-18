import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 0.75rem;

  overflow: hidden;

  .table__content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: 0.25rem;

    overflow: scroll;
  }

  .table__head {
    display: grid;
    width: 100%;
    gap: 0.5rem;

    background-color: ${({ theme }) => theme['white-150']};
    padding: 0.5rem 1.5rem;
    border-radius: 0.5rem;
  }

  .table__body {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.25rem;
  }

  .table__row {
    display: grid;
    width: 100%;
    gap: 0.5rem;

    padding: 0.25rem 1.5rem;
  }

  .table__pagination {
    display: flex;
    align-self: flex-end;
    gap: 0.375rem;

    list-style: none;

    margin-top: auto;
    margin-right: 2.5rem;
    margin-bottom: 1.5rem;

    li a {
      cursor: pointer;
      padding: 0.25rem 0.625rem;
      border-radius: 0.3125rem;
      background: ${({ theme }) => theme['white-150']};

      color: ${({ theme }) => theme['black-1000']};
      font-weight: 500;
      font-size: 0.75rem;
    }

    li.selected a {
      background: ${({ theme }) => theme['white-250']};
    }
  }
`;
