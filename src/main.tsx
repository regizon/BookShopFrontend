import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.tsx'
import BookPage from '../src/Components/BookPage/BookPage.tsx'
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./Components/Layout/Layout.tsx"
import CartProvider from "./Providers/CartProvider.tsx";
import AuthProvider from "./Providers/AuthProvider.tsx";
import ModalProvider from "./Providers/ModalProvider.tsx";
import CheckoutPage from "./Components/CheckoutPage/CheckoutPage.tsx";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute.tsx";
import ProfilePage from "./Components/ProfilePage/ProfilePage.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ModalProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                      <Route element={<Layout />}>
                          <Route path="/" element={<App />} />
                          <Route element={<ProtectedRoute />}>
                              <Route path={"checkout/"} element={<CheckoutPage />}/>
                              <Route path={"profile/"} element={<ProfilePage />}/>
                          </Route>
                          <Route path="books/:bookId" element={<BookPage />} />
                      </Route>
                  </Routes>
              </BrowserRouter>
          </CartProvider>
      </AuthProvider>
    </ModalProvider>
)
