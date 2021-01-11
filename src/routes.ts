import * as Pages from "./pages";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    exact: true,
    component: Pages.Dashboard,
  },
  {
    path: "/sign-in",
    name: "Sign In",
    component: Pages.SignIn,
  },
  {
    path: "/sign-up",
    name: "Sign Up",
    component: Pages.SignUp,
  },
  {
    path: "/new-client",
    name: "Create New Client",
    component: Pages.CreateClient,
  },
  {
    path: "/clients/:clientId",
    name: "View Client",
    component: Pages.ViewClient,
  },
  {
    exact: false,
    component: Pages.NotFound,
  },
];

export default routes;
