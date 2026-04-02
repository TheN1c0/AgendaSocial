import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isDemoPending, setIsDemoPending] = useState(false);
  const { login } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    if (isDemoPending && turnstileToken) {
      handleLoginAction({ email: 'demo@tuapp.cl', password: 'demo1234' });
    }
  }, [isDemoPending, turnstileToken]);

  const handleLoginAction = async (credentials: { email: string, password: string }) => {
    setError('');
    try {
      setLoading(true);
      const { token, usuario } = await authService.login({ ...credentials, turnstileToken });
      login(token, usuario);
      navigate('/dashboard');
    } catch (err: any) {
      setFailedAttempts(prev => prev + 1);
      setError(err.message || 'Error al iniciar sesión');
      setTurnstileToken(''); // Limpiar token si falla
      setIsDemoPending(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email && password) {
      handleLoginAction({ email, password });
    }
  };

  const handleDemo = () => {
    setIsDemoPending(true);
    setTurnstileToken('');
  };

  const needsCaptcha = failedAttempts >= 3 || isDemoPending;

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 relative transition-colors ${isDark ? 'dark bg-[#121212]' : 'bg-[#f8f9fa]'} `}>
      
      {/* HEADER SECTION */}
      <div className="text-center mb-8 mt-auto z-10 pt-12">
        <h1 className="text-3xl font-bold text-[#8c3a4f] dark:text-[#C97A8A] tracking-tight m-0">Gestor de Casos</h1>
        <p className="text-gray-600 dark:text-gray-400 font-medium tracking-wide mt-1 m-0">Trabajo Social</p>
      </div>

      {/* LOGIN CARD */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-[420px] overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col items-center pt-8 z-10 transition-colors">
        
        {/* LOGO */}
        <div className="mb-4 flex items-center justify-center">
          <img 
             src="/bravo-bytes.svg" 
             alt="Bravo Bytes Logo" 
             className="h-[96px] w-auto transition-all" 
          />
        </div>

        <h2 className="text-[1.1rem] text-gray-800 dark:text-gray-200 font-medium mb-6">Inicie sesión en su panel</h2>

        {/* ERROR MSG */}
        {error && (
          <div className="w-[85%] px-6 mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 py-2 text-center rounded">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full px-8 pb-4 flex flex-col gap-4">
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <input
              type="text"
              placeholder="Nombre de usuario o correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-[#f5f7fa] dark:bg-[#242424] border border-[#e5e7eb] dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#C97A8A] focus:border-[#C97A8A] transition-all placeholder:text-gray-400 placeholder:font-normal"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-[#f5f7fa] dark:bg-[#242424] border border-[#e5e7eb] dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#C97A8A] focus:border-[#C97A8A] transition-all placeholder:text-gray-400 placeholder:font-normal"
              required
            />
          </div>

          {needsCaptcha && (
            <div className="flex justify-center my-1">
              <Turnstile 
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAACvP4r6jlY_ivNWC'} 
                onSuccess={(token) => setTurnstileToken(token)}
                options={{ theme: isDark ? 'dark' : 'light' }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (failedAttempts >= 3 && !turnstileToken)}
            className={`w-full text-white py-2.5 rounded-lg font-medium transition-colors mt-2 text-[15px] shadow-sm cursor-pointer ${
              loading || (failedAttempts >= 3 && !turnstileToken) 
                ? 'bg-[#C97A8A]/50 cursor-not-allowed' 
                : 'bg-[#C97A8A] hover:bg-[#b06170]'
            }`}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          
          <div className="text-center mt-2 mb-2">
            <a href="#" className="text-[13px] text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">¿Olvidó su contraseña?</a>
          </div>

          {/* DEMO BUTTON */}
          <button
            type="button"
            onClick={handleDemo}
            disabled={loading || isDemoPending}
            className="w-full bg-white dark:bg-[#2a2a2a] border-2 border-dashed border-[#C97A8A]/40 hover:border-[#C97A8A] hover:bg-[#C97A8A]/5 text-[#C97A8A] py-2 rounded-lg font-medium transition-colors text-[14px] flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            {isDemoPending ? 'Verificando seguridad...' : 'Probar Sistema (Demo Automático)'}
          </button>

        </form>

        {/* CARD FOOTER */}
        <div className="w-full bg-[#f8f9fa] dark:bg-[#1a1a1a]/80 py-4 mt-2 border-t border-gray-100 dark:border-gray-800 flex justify-center items-center gap-2">
          <img src="/bravobytesrosa.svg" alt="Bravo Bytes" className="h-[22px] object-contain opacity-80" />
          <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300 tracking-tight">bravo-bytes</span>
        </div>

      </div>

      {/* BOTTOM FOOTER */}
      <div className="mt-auto mb-6 pt-12 text-center flex flex-col items-center gap-3 w-full z-10 transition-colors">
        <p className="text-[13px] text-gray-400 dark:text-gray-500 m-0">Todos los derechos reservados</p>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-[13px] font-medium text-gray-400 dark:text-gray-500">Tema oscuro</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={isDark}
              onChange={toggleTheme}
            />
            <div className={`block w-9 h-5 rounded-full transition-colors ${isDark ? 'bg-[#5e1e2d] dark:bg-[#C97A8A]' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-[2px] top-[2px] bg-white w-4 h-4 rounded-full transition-transform ${isDark ? 'transform translate-x-4' : ''}`}></div>
          </div>
        </label>
      </div>

    </div>
  );
};
