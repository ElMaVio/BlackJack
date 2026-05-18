package juegos_microservicio.juegos_microservicio.Repository;

import juegos_microservicio.juegos_microservicio.Models.Entities.Juegos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JuegoRepository extends JpaRepository<Juegos, Integer> {
    
}