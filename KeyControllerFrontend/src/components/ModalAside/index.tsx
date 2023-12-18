import { MaterialSymbol } from "..";
import { Container } from "./styles"

interface Props {
  isOpen: boolean;
  close(): void;
  title: string;
  children: React.ReactNode;
}

export const ModalAside: React.FC<Props> = ({ isOpen, close, title, children }) => {
  return (
    <>
      <div className={`overlay ${!isOpen ? 'overlay--closed' : ''}`} onClick={close}></div>
      <Container className={`${isOpen ? 'modal--open' : ''}`}>
        <div className="modal__header">
          <h4 className="header4">{title}</h4>

          <button className="modal__close" type="button" onClick={close}>
            <MaterialSymbol name="close" />
          </button>
        </div>

        <div className="modal__content">
          {children}
        </div>
      </Container>
    </>
  )
}