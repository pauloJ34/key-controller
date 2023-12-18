import { MaterialSymbol } from "..";
import { Container } from "./styles"

interface Props {
  isOpen: boolean;
  close(): void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<Props> = ({ isOpen, close, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={close}></div>
      <Container>
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