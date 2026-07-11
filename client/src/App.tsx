import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import UserProfile from "./pages/UserProfile";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/AdminDashboard";
import Comparison from "./pages/Comparison";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/static/About";
import Blog from "./pages/static/Blog";
import Careers from "./pages/static/Careers";
import Help from "./pages/static/Help";
import Contact from "./pages/static/Contact";
import FAQ from "./pages/static/FAQ";
import Privacy from "./pages/static/Privacy";
import Terms from "./pages/static/Terms";
import Cookies from "./pages/static/Cookies";

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/catalog"} component={Catalog} />
        <Route path={"/product/:id"} component={ProductDetail} />
        <Route path={"/cart"} component={Cart} />
        <Route path={"/checkout"} component={Checkout} />
        <Route
          path={"/order-confirmation/:orderId"}
          component={OrderConfirmation}
        />
        <Route path={"/profile"} component={UserProfile} />
        <Route path={"/wishlist"} component={Wishlist} />
        <Route path={"/comparison"} component={Comparison} />
        <Route path={"/admin/dashboard"} component={AdminDashboard} />
        <Route path={"/login"} component={Login} />
        <Route path={"/register"} component={Register} />
        {/* Static / info pages */}
        <Route path={"/about"} component={About} />
        <Route path={"/blog"} component={Blog} />
        <Route path={"/careers"} component={Careers} />
        <Route path={"/help"} component={Help} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/faq"} component={FAQ} />
        <Route path={"/privacy"} component={Privacy} />
        <Route path={"/terms"} component={Terms} />
        <Route path={"/cookies"} component={Cookies} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <ComparisonProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ComparisonProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
