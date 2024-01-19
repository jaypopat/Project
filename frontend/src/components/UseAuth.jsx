import { useState, useEffect } from 'react';
import checkAuth from '../../auth/auth_observer';

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}

export default useAuth;
