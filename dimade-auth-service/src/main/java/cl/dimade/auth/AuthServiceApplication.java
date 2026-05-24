package cl.dimade.auth;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
@EnableDiscoveryClient
public class AuthServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}

	@Bean
	public CommandLineRunner fixDatabase(JdbcTemplate jdbcTemplate) {
		return args -> {
			System.out.println("Verificando y parchando base de datos...");
			try {
				// Agregar columna status si no existe
				jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(255) DEFAULT 'PENDING'");
				// Agregar columna needs_password_change si no existe
				jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS needs_password_change BOOLEAN DEFAULT FALSE");
				System.out.println("Base de datos parchada exitosamente.");
			} catch (Exception e) {
				System.err.println("Error al parchar base de datos: " + e.getMessage());
			}
		};
	}

}
