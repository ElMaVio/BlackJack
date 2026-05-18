package eventos_microserevicios.eventos_microserevicios.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import eventos_microserevicios.eventos_microserevicios.Models.Entities.Eventos;
import eventos_microserevicios.eventos_microserevicios.Models.dto.EventosDTO;
import eventos_microserevicios.eventos_microserevicios.Models.requests.EventosActualizarRequests;
import eventos_microserevicios.eventos_microserevicios.Models.requests.EventosRequests;
import eventos_microserevicios.eventos_microserevicios.Repository.EventosRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventosServices {

    @Autowired
    private EventosRepository eventosRepository;

    // 1. OBTENER TODOS LOS EVENTOS
    public List<EventosDTO> obtenerTodos() {
        return eventosRepository.findAll().stream().map(this::convertirADto).collect(Collectors.toList());
    }

    // 2. CREAR UN NUEVO EVENTO
    public String crearEvento(EventosRequests request) {
        try {
            Eventos evento = new Eventos();
            evento.setNombre(request.getNombre());
            evento.setDeporte(request.getDeporte());
            evento.setLiga(request.getLiga());
            evento.setEquipoLocal(request.getEquipoLocal());
            evento.setEquipoVisitante(request.getEquipoVisitante());
            evento.setFechaInicio(request.getFechaInicio());
            evento.setEstado(request.getEstado());

            eventosRepository.save(evento);
            return "¡Evento deportivo creado con éxito!";
        } catch (Exception e) {
            return "Error al crear el evento: " + e.getMessage();
        }
    }

    // 3. ACTUALIZAR UN EVENTO EXISTENTE
    public String actualizarEvento(EventosActualizarRequests request) {
        Optional<Eventos> encontrado = eventosRepository.findById(request.getIdEvento());
        if (encontrado.isPresent()) {
            Eventos evento = encontrado.get();
            evento.setNombre(request.getNombre());
            evento.setDeporte(request.getDeporte());
            evento.setLiga(request.getLiga());
            evento.setEquipoLocal(request.getEquipoLocal());
            evento.setEquipoVisitante(request.getEquipoVisitante());
            evento.setFechaInicio(request.getFechaInicio());
            evento.setEstado(request.getEstado());

            eventosRepository.save(evento);
            return "¡Evento ID " + request.getIdEvento() + " actualizado correctamente!";
        }
        return "No se encontró el evento con ID: " + request.getIdEvento();
    }

    // 4. ELIMINAR UN EVENTO
    public String eliminarEvento(int id) {
        if (eventosRepository.existsById(id)) {
            eventosRepository.deleteById(id);
            return "Evento eliminado exitosamente.";
        }
        return "El evento que intentas eliminar no existe.";
    }

    
    private EventosDTO convertirADto(Eventos evento) {
        EventosDTO dto = new EventosDTO();
        dto.setIdEvento(evento.getIdEvento());
        dto.setNombre(evento.getNombre());
        dto.setDeporte(evento.getDeporte());
        dto.setLiga(evento.getLiga());
        dto.setEquipoLocal(evento.getEquipoLocal());
        dto.setEquipoVisitante(evento.getEquipoVisitante());
        dto.setFechaInicio(evento.getFechaInicio());
        dto.setEstado(evento.getEstado());
        return dto;
    }
}