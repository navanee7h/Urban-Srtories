import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import MeasurementGuide from "./pages/MeasurementGuide";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/shop",
    Component: Shop,
  },
  {
    path: "/product/:id",
    Component: ProductDetail,
  },
  {
    path: "/measurement-guide",
    Component: MeasurementGuide,
  },
  {
    path: "/about",
    Component: About,
  },
  {
    path: "/cart",
    Component: Cart,
  },
  {
    path: "/checkout",
    Component: Checkout,
  },
  {
    path: "/account",
    Component: Account,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/admin",
    Component: AdminRoute,
    children: [
      {
        path: '',
        Component: AdminLayout,
        children: [
          {
            index: true,
            Component: AdminDashboard,
          }
        ]
      }
    ]
  },
  {
    path: "*",
    Component: NotFound,
  },
]);