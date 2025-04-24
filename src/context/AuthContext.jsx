import React, { createContext, useState, useContext, useEffect } from 'react';

// Creamos el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Registrar nuevo usuario
  const register = (name, email, password) => {
    // Obtener usuarios existentes o inicializar array vacío
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verificar si el email ya está registrado
    if (users.some(user => user.email === email)) {
      throw new Error('El correo electrónico ya está registrado');
    }
    
    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password // En producción deberías hashear la contraseña
    };
    
    // Guardar el nuevo usuario
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Iniciar sesión automáticamente
    setCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email });
    localStorage.setItem('currentUser', JSON.stringify({ 
      id: newUser.id, 
      name: newUser.name, 
      email: newUser.email 
    }));
    
    return newUser;
  };

  // Iniciar sesión
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Buscar usuario
    const user = users.find(user => user.email === email && user.password === password);
    
    if (!user) {
      throw new Error('Credenciales incorrectas');
    }
    
    // Guardar usuario en estado y localStorage (sin la contraseña)
    const userData = { id: user.id, name: user.name, email: user.email };
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    return userData;
  };

  // Cerrar sesión
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!currentUser;
  };

  const value = {
    currentUser,
    register,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};