package usuarios_microservicios.usuarios_microservicios;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import usuarios_microservicios.usuarios_microservicios.Models.Entities.Usuario;
import usuarios_microservicios.usuarios_microservicios.Repository.UsuarioRepository;

@SpringBootApplication
public class UsuariosMicroserviciosApplication {

	public static void main(String[] args) {
		SpringApplication.run(UsuariosMicroserviciosApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(UsuarioRepository repository) {
		return args -> {
			boolean adminExiste = repository.findAll().stream()
					.anyMatch(u -> "admin0".equals(u.getUsername()));
					
			if (!adminExiste) {
				Usuario admin = new Usuario();
				admin.setUsername("admin0");
				admin.setEmail("admin0@blackjack.com");
				admin.setPassword_hash("admin123"); // En un entorno real esto iría encriptado (Bcrypt)
				admin.setRol("ADMIN");
				admin.setEstado("ACTIVO");
				repository.save(admin);
				System.out.println("====== Usuario 'admin0' creado por defecto (Rol: ADMIN) ======");
			}
		};
	}
}
