import { useCallback } from "react";
import { MaterialSymbol } from "..";
import { Container } from "./styles";

interface HeaderAction {
  icon: React.ReactNode;
  onClick(): void;
}

export interface HeaderProps {
  title: string;
  search?: boolean;
  onSearch?: (text: string) => void;
  actions?: Array<HeaderAction>
}

export const Header: React.FC<HeaderProps> = ({ title, search, onSearch, actions }) => {
  const renderSearch = useCallback(() => {
    if (!search) return null;

    return (
      <label htmlFor="search" className="header__search">
        <MaterialSymbol name="search" />
        <input id="search" name="search" type="text" placeholder="pesquisar" className="text" onChange={(e) => onSearch && onSearch(e.target.value)} />
      </label>
    )
  }, [search]);

  const renderActions = useCallback(() => {
    return actions?.map((action, index) => (
      <button key={`${index}`} type="button" onClick={action.onClick} className="header__action">
        {action.icon}
      </button>
    ))
  }, [actions])

  return (
    <Container>
      <h2 className="header4">{title}</h2>

      <div className="header__actions">
        {renderSearch()}
        {renderActions()}
      </div>
    </Container>
  )
}