import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import AppRoutes from '@/routes';
import { supabase } from '@/config/supabase';

console.log('[App] App.tsx montado');

supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, session);
});

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster />
    </AuthProvider>
  );
}
