package usuarios_microservicios.usuarios_microservicios.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import usuarios_microservicios.usuarios_microservicios.Models.Entities.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
}
