import { MaterialSymbol, Modal } from "@/components";
import { UserModel, UserType } from "@/models";
import { api } from "@/services/api";
// import { getSuapUser } from "@/services/suap/data";
import { suapLogin } from "@/services/suap/login";
import { userService } from "@/services/user";
import { Credentials } from "@/types";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const tokenName = '@key-controller:access';

export interface AuthContextProps {
  status: AuthStatus;
  user?: UserModel;
  login: (data: Credentials) => Promise<void>;
  logout: () => void;
  ensureAuth: (effect: () => void, userType?: UserType[]) => () => void
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export const AuthContext = createContext({} as AuthContextProps);

interface Props {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<UserModel>()

  const [loginEffect, setLoginEffect] = useState<() => () => void>();
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const loginForm = useForm<Credentials>();

  const login = async (data: Credentials) => {
    if (isLoginLoading) return;
    setIsLoginLoading(true);

    try {
      const tokens = await suapLogin(data);
      // const suapUser = await getSuapUser(tokens.access);
      // const suapUser = await getSuapUser(tokens.token);
      // const { token } = await userService.login(suapUser);

      // localStorage.setItem(tokenName, token);
      localStorage.setItem(tokenName, tokens.token);
      await auth()

      loginForm.reset();

      if (loginEffect) {
        try { loginEffect()() } catch (e) { }
        setLoginEffect(undefined);
      };
    } catch (error) {
      toast.error('Credenciais inválidas!')
    } finally {
      setIsLoginLoading(false);
    }
  }

  const logout = () => {
    localStorage.removeItem(tokenName);
    api.defaults.headers.common.Authorization = undefined;
    setStatus('unauthenticated');
    setUser(undefined);
  }

  const auth = useCallback(async () => {
    const token = localStorage.getItem(tokenName);

    if (token && status === 'loading') {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      try {
        const data = await userService.getData();

        setUser(data);
        setStatus('authenticated');
      } catch (error) {
        logout();
      }
    }
  }, [status, logout])

  const ensureAuth = useCallback((effect: () => void, userType: UserType[] = []) => {
    return () => {

      if (status === 'authenticated') {
        if (user?.type && userType.length > 0 && !userType.includes(user.type)) {
          toast('Você não possui permissão!', {
            id: 'permission-denied',
            icon: <MaterialSymbol name="warning" />,
            duration: 2000
          })
          return;
        }

        effect();
        return;
      }

      setLoginEffect(() => effect);
    }
  }, [status, user]);

  useEffect(() => { auth() }, [auth])

  const value = useMemo(() => ({ status, user, login, logout, ensureAuth }), [status, user, ensureAuth])

  return (
    <AuthContext.Provider value={value}>
      {children}

      <Modal title="Login" isOpen={!!loginEffect} close={() => !isLoginLoading ? setLoginEffect(undefined) : null}>
        <form onSubmit={loginForm.handleSubmit(login)}>
          <label className="input__wrapper" htmlFor="username">
            Matrícula
            <input id="username" type="text" className="form__input" placeholder="Digite a sua matrícula" {...loginForm.register('username')} />
          </label>

          <label className="input__wrapper" htmlFor="password">
            Senha
            <input id="password" type="password" className="form__input" placeholder="Digite a sua senha" {...loginForm.register('password')} />
          </label>

          <button className="form__button" disabled={isLoginLoading}>
            {!isLoginLoading ? 'Logar' : 'Carregando...'}
          </button>
        </form>
      </Modal>
    </AuthContext.Provider>
  )
}