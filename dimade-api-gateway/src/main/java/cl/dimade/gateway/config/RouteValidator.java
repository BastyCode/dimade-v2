package cl.dimade.gateway.config;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    public static final List<String> openApiEndpoints = List.of(
            "/api/v1/auth/register",
            "/api/v1/auth/authenticate",
            "/eureka"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> {
                // Permitir todas las peticiones OPTIONS (preflight CORS)
                if (request.getMethod().name().equals("OPTIONS")) {
                    return false;
                }
                return openApiEndpoints
                        .stream()
                        .noneMatch(uri -> request.getURI().getPath().contains(uri));
            };

}
