import ReactPaginate from 'react-paginate';
import { Header, HeaderProps } from "../Header";
import { Container } from "./styles";

interface TableProps {
  header: HeaderProps
  head: React.ReactNode;
  body: React.ReactNode;
  pagination?: {
    pages: number;
    current: number;
    onPageChange(page: number): void;
  }
}

export function Table({ header, head, body, pagination }: TableProps) {
  return (
    <Container>
      <Header {...header} />

      <div className="table__content">
        {head}
        {body}
      </div>

      {pagination ? (
        <ReactPaginate
          className="table__pagination"
          breakLabel="..."
          nextLabel=">"
          onPageChange={({ selected }) => pagination.onPageChange(selected)}
          marginPagesDisplayed={2}
          pageCount={pagination.pages}
          previousLabel="<"

        />
      ) : null}
    </Container>
  )
}

type SafeSize = `${number}${'px' | 'rem' | 'fr'}`;

interface TableHeadProps {
  columns: Array<{
    label: string;
    size: SafeSize;
    minSize?: SafeSize;
  }>;
}

Table.Head = ({ columns }: TableHeadProps) => {
  const gridTemplateColumns = columns.map((column) => column.size).join(' ');

  return (
    <div className="table__head" style={{ gridTemplateColumns }}>
      {columns.map((column) => (
        <span key={column.label} className="text" style={{ minWidth: column.minSize }}>{column.label}</span>
      ))}
    </div>
  )
}

interface TableBodyProps<O> {
  columns: Array<{ field: keyof O, size: SafeSize, minSize?: SafeSize }>;
  rows: Array<O>
}

Table.Body = function <O extends {}>({ columns, rows }: TableBodyProps<O>) {
  const gridTemplateColumns = columns.map((column) => column.size).join(' ');

  function renderRow(row: O, index: number) {
    return (
      <div key={`${index}`} className="table__row" style={{ gridTemplateColumns }}>
        {columns.map((column) => (
          <span key={`${index}-${column.field.toString()}`} className="text" style={{ minWidth: column.minSize }}>
            {row[column.field]}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="table__body">
      {rows.map(renderRow)}
    </div>
  )
}