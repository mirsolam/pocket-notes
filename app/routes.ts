import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/dashboard.tsx"),
    route("login", "routes/login.tsx"),
    route("signup", "routes/signup.tsx"),
    route("forgot-password", "routes/forgotPassword.tsx"),
    route("note", "routes/note.tsx"),
    route("notebook", "routes/notebook.tsx"),

] satisfies RouteConfig;
