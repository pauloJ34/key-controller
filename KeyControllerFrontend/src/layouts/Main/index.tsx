import { Aside } from "@/components";
import { Container } from "./styles";
import { Outlet } from "react-router-dom";

export const MainLayout: React.FC = ({ }) => {
  return (
    <Container>
      <div className="container__content">
        <Aside />

        <main className="content__inner">
          <Outlet />
        </main>
      </div>
    </Container>
  )
}