import { useAuth } from '@/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { MaterialSymbol } from '..';
import { Container } from './styles';

export const Aside: React.FC = () => {
  const { logout, ensureAuth } = useAuth();

  const navigate = useNavigate();

  return (
    <Container id="sidebar" aria-label="Sidebar">
      <Link to="/" tabIndex={0} className='aside__link header4'>
        KeyController
      </Link>

      <nav className='aside__nav'>

        <Link to={'/'} tabIndex={0} className='aside__link text'>
          <MaterialSymbol name='key' />
          Chaves
        </Link>

        <Link to={'/sectors'} tabIndex={0} className='aside__link'>
          <MaterialSymbol name='pin_drop' />
          Setores
        </Link>

        <Link to={'/schedules'} tabIndex={0} className='aside__link'>
          <MaterialSymbol name='calendar_month' />
          Agendamentos
        </Link>

        <Link to={'/history'} tabIndex={0} className='aside__link'>
          <MaterialSymbol name='history' />
          Histórico
        </Link >

        <button tabIndex={0} className='aside__link' onClick={ensureAuth(() => navigate('/user'))}>
          <MaterialSymbol name='person' />
          Usuário
        </button>
      </nav >

      <button tabIndex={0} className='aside__link aside__logout text' onClick={logout}>
        <MaterialSymbol name='logout' />
        Sair
      </button>
    </Container >
  )
}