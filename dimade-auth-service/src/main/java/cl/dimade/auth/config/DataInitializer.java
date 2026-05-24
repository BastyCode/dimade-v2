package cl.dimade.auth.config;

import cl.dimade.auth.user.Role;
import cl.dimade.auth.user.RoleRepository;
import cl.dimade.auth.user.User;
import cl.dimade.auth.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            System.out.println("Iniciando DataInitializer...");
            try {
                // Inicializar Roles
                if (roleRepository.count() == 0) {
                    roleRepository.save(new Role("ADMIN"));
                    roleRepository.save(new Role("SELLER"));
                    roleRepository.save(new Role("USER"));
                    System.out.println("Roles inicializados: ADMIN, SELLER, USER");
                }

                // Inicializar Admin por defecto
                if (userRepository.findByEmail("admin@dimade.cl").isEmpty()) {
                    System.out.println("Creando usuario admin por defecto...");
                    Role adminRole = roleRepository.findByName("ADMIN")
                            .orElseGet(() -> roleRepository.save(new Role("ADMIN")));

                    User admin = new User();
                    admin.setFirstName("Admin");
                    admin.setLastName("Dimade");
                    admin.setEmail("admin@dimade.cl");
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setEnabled(true);
                    admin.setRoles(Set.of(adminRole));

                    userRepository.save(admin);
                    System.out.println("Usuario Admin inicializado: admin@dimade.cl / admin123");
                }
            } catch (Exception e) {
                System.err.println("ERROR en DataInitializer: " + e.getMessage());
            }
        };
    }
}
