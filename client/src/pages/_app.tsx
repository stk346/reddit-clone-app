import Axios from 'axios'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../context/auth';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';

function MyApp({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  Axios.defaults.withCredentials = true;

  // login, register 페이지에서는 NavBar를 보여주지 않음
  const {pathname} = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  return <AuthProvider>
    {!authRoute && <NavBar />}
    <Component {...pageProps} />
    </AuthProvider>
}

export default MyApp
