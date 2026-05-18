package juegos_microservicio.juegos_microservicio.Services;

import juegos_microservicio.juegos_microservicio.Models.Entities.Juegos;
import juegos_microservicio.juegos_microservicio.Models.dto.JuegosDTO;
import juegos_microservicio.juegos_microservicio.Models.requests.JuegosRequests;
import juegos_microservicio.juegos_microservicio.Models.requests.JuegosRequestsActualizar;
import juegos_microservicio.juegos_microservicio.Repository.JuegoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JuegosServices {

    @Autowired
    private JuegoRepository juegoRepository;

    // Obtener todos mapeados a DTO
    public List<JuegosDTO> obtenerTodosLosJuegos() {
        return juegoRepository.findAll().stream().map(juego -> {
            JuegosDTO dto = new JuegosDTO();
            dto.setIdjuego(juego.getIdjuego());
            dto.setNombre(juego.getNombre());
            dto.setTipo(juego.getTipo());
            dto.setProveedor(juego.getProveedor());
            dto.setEstado(juego.getEstado());
            return dto;
        }).collect(Collectors.toList());
    }

    // Crear juego nuevo
    public JuegosDTO crearJuego(JuegosRequests request) {
        Juegos nuevoJuego = new Juegos();
        nuevoJuego.setNombre(request.getNombre());
        nuevoJuego.setTipo(request.getTipo());
        nuevoJuego.setProveedor(request.getProveedor());
        nuevoJuego.setEstado(request.getEstado());

        Juegos guardado = juegoRepository.save(nuevoJuego);
        return mapearADto(guardado);
    }

    // Actualizar juego existente
    public JuegosDTO actualizarJuego(JuegosRequestsActualizar request) {
        Optional<Juegos> existe = juegoRepository.findById(request.getIdJuego());
        if (existe.isPresent()) {
            Juegos juego = existe.get();
            juego.setNombre(request.getNombre());
            juego.setTipo(request.getTipo());
            juego.setProveedor(request.getProveedor());
            juego.setEstado(request.getEstado());
            
            return mapearADto(juegoRepository.save(juego));
        }
        return null;
    }

    // Eliminar juego
    public boolean eliminarJuego(int id) {
        if (juegoRepository.existsById(id)) {
            juegoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Método helper para no repetir código de mapeo
    private JuegosDTO mapearADto(Juegos juego) {
        JuegosDTO dto = new JuegosDTO();
        dto.setIdjuego(juego.getIdjuego());
        dto.setNombre(juego.getNombre());
        dto.setTipo(juego.getTipo());
        dto.setProveedor(juego.getProveedor());
        dto.setEstado(juego.getEstado());
        return dto;
    }
}