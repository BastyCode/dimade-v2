package cl.dimade.auth.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/{id}/approve")
    public Map<String, String> approveUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Generar clave temporal
        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
        
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setEnabled(true);
        user.setStatus("APPROVED");
        user.setNeedsPasswordChange(true);
        
        userRepository.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("temporaryPassword", tempPassword);
        response.put("message", "Usuario aprobado con éxito");
        return response;
    }

    @PutMapping("/{id}/status")
    public User updateStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(status.get("enabled"));
        return userRepository.save(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}
