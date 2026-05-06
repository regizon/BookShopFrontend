import ReactDOM from "react-dom/client";
import './App.module.css'
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
import CategoryPage from "./Components/CategoryPage/CategoryPage.tsx";
import ProfileSettings from "./Components/ProfileSettings/ProfileSettings.tsx";
import OrdersPage from "./Components/OrdersPage/OrdersPage.tsx";
import AdminRoute from "./Components/AdminRoute/AdminRoute.tsx";
import AddBookPage from "./Components/AddBookPage/AddBookPage.tsx";
import BookCollectionManager from "./Components/BookCollectionManager/BookCollectionManager.tsx";
import AdminOrdersPage from "./Components/AdminOrdersPage/AdminOrdersPage.tsx";

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
                          </Route>
                          <Route path="books/:bookId" element={<BookPage />} />
                          <Route path="books/category/:slug" element={<CategoryPage />}/>
                      </Route>
                  <Route element={<ProtectedRoute />}>
                      <Route element={<ProfilePage />}>
                                  <Route path={"profile/"} element={<ProfileSettings />}/>
                                  <Route path={"orders/"} element={<OrdersPage />}/>
                                  <Route element={<AdminRoute />}>
                                      <Route path={"admin/orders"} element={<AdminOrdersPage />}/>
                                      <Route path={"admin/add/"} element={<AddBookPage />} />
                                      <Route path={"admin/collections/add/"} element={<BookCollectionManager />} />
                                  </Route>
                      </Route>
                  </Route>
              </Routes>
            </BrowserRouter>
          </CartProvider>
      </AuthProvider>
    </ModalProvider>
)
