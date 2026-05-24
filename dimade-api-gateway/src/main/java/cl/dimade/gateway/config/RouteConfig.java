package cl.dimade.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {

    private final AuthenticationFilter authenticationFilter;

    public RouteConfig(AuthenticationFilter authenticationFilter) {
        this.authenticationFilter = authenticationFilter;
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Ruta para AUTH-SERVICE (Login, Registro y Gestión de Usuarios)
                .route("auth-service", r -> r.path("/api/v1/auth/**", "/api/v1/users/**")
                        .uri("lb://AUTH-SERVICE"))
                
                // Ruta para CATALOG-SERVICE (Categorías y Productos) con Seguridad
                .route("catalog-service", r -> r.path("/api/v1/categories/**", "/api/v1/products/**")
                        .filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://CATALOG-SERVICE"))
                
                // Ruta para CRM-SERVICE (Clientes, Proveedores, Cotizaciones) con Seguridad
                .route("crm-service", r -> r.path("/api/crm/**")
                        .filters(f -> f.filter(authenticationFilter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://CRM-SERVICE"))
                
                .build();
    }
}
