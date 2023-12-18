import { useState } from "react";
import { Container } from "./styles";
import { useClickOutside } from "@/hooks";

interface DropdownItem {
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

interface Props {
  label: React.ReactNode,
  elements: Array<DropdownItem>
}

export const DropdownMenu: React.FC<Props> = ({ label, elements }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));

  const clickAction = (action: () => void) => {
    return () => {
      action();
      setIsOpen(false);
    }
  }

  return (
    <Container ref={ref}>
      <button type="button" className="dropdown__toggle" onClick={() => setIsOpen(!isOpen)}>
        {label}
      </button>

      {isOpen && (
        <div className="dropdown__items">
          {elements.map((element) => (
            <button key={element.label} className="dropdown__item" onClick={clickAction(element.action)}>
              {element.icon}
              {element.label}
            </button>
          ))}
        </div>
      )}
    </Container>
  )
}