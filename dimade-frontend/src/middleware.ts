import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    const { url, cookies, redirect } = context;

    // Solo proteger rutas que empiecen con /admin
    if (url.pathname.startsWith("/admin")) {
        const token = cookies.get("dimade_token")?.value;

        if (!token) {
            return redirect("/auth/login");
        }
    }

    return next();
});
