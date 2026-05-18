package LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Repository;

import LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Models.Entities.LimitesResponsables;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LimitesResponsablesRepository extends JpaRepository<LimitesResponsables, Integer> {
    
    
    Optional<LimitesResponsables> findByUsuariosIdUsuario(int usuariosIdUsuario);
}