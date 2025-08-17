import Cookies from 'js-cookie';

export const isLoggedIn = (): boolean => {
    // Check if JWT token exists in cookies
    const token = Cookies.get('token');
    return !!token;
};

export const login = (username: string, password: string): boolean => {
    // Mock login: set a fake JWT token in cookies if credentials match
    if (username === 'user' && password === 'password') {
        // Replace with real JWT from backend in production
        Cookies.set('token', 'mock-jwt-token', { expires: 1 });
        return true;
    }
    return false;
};

export const logout = (): void => {
    // Remove JWT token from cookies
    Cookies.remove('token');
};