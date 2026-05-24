package cl.dimade.auth.auth;

import cl.dimade.auth.config.JwtService;
import cl.dimade.auth.user.Role;
import cl.dimade.auth.user.RoleRepository;
import cl.dimade.auth.user.User;
import cl.dimade.auth.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthenticationService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    public AuthenticationResponse register(RegisterRequest request) {
        System.out.println("Registrando nuevo usuario: " + request.getEmail());
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        Set<Role> roles = new HashSet<>();
        
        // Lógica: Si es el primer usuario del sistema, hacerlo ADMIN
        long userCount = userRepository.count();
        if (userCount == 0) {
            System.out.println("Primer usuario detectado. Asignando rol ADMIN.");
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> roleRepository.save(new Role("ADMIN")));
            roles.add(adminRole);
        } else {
            System.out.println("Usuario normal detectado. Asignando rol USER.");
            Role userRole = roleRepository.findByName("USER")
                    .orElseGet(() -> roleRepository.save(new Role("USER")));
            roles.add(userRole);
        }
        
        // Si se enviaron roles específicos (para uso futuro/interno)
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            for (String roleName : request.getRoles()) {
                Role role = roleRepository.findByName(roleName)
                        .orElseGet(() -> roleRepository.save(new Role(roleName)));
                roles.add(role);
            }
        }
        
        user.setRoles(roles);
        
        // El primer usuario (ADMIN) se activa automáticamente, los demás quedan desactivados
        if (userCount == 0) {
            user.setEnabled(true);
            user.setStatus("APPROVED");
        } else {
            user.setEnabled(false);
            user.setStatus("PENDING");
        }
        
        userRepository.save(user);
        System.out.println("Usuario guardado exitosamente: " + user.getEmail() + " - Activo: " + user.isEnabled());
        
        // Si no está activado, no generamos tokens de sesión todavía
        if (!user.isEnabled()) {
            return new AuthenticationResponse(null, null);
        }
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("roles", userDetails.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(Collectors.toList()));

        String jwtToken = jwtService.generateToken(extraClaims, userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);
        
        return new AuthenticationResponse(jwtToken, refreshToken);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        System.out.println("Intentando autenticar usuario: " + request.getEmail());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            System.out.println("Autenticación exitosa para: " + request.getEmail());
        } catch (Exception e) {
            System.out.println("Autenticación fallida para: " + request.getEmail() + " - Error: " + e.getMessage());
            throw e;
        }
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("roles", userDetails.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(Collectors.toList()));

        String jwtToken = jwtService.generateToken(extraClaims, userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);
        
        // Buscar el usuario para obtener el flag de cambio de contraseña
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        return new AuthenticationResponse(jwtToken, refreshToken, user.isNeedsPasswordChange());
    }
}
