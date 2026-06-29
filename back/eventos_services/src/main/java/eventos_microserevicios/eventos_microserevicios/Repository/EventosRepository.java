package eventos_microserevicios.eventos_microserevicios.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eventos_microserevicios.eventos_microserevicios.Models.Entities.Eventos;

@Repository
public interface EventosRepository extends JpaRepository<Eventos, Integer> {
}