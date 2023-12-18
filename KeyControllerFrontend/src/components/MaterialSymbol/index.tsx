interface Props {
  name: string;
}

export const MaterialSymbol: React.FC<Props> = ({ name }) => {
  return <span className="material__symbol material-symbols-outlined">{name}</span>
}