package eventos_microserevicios.eventos_microserevicios.Models.requests;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventosRequests {
    private String nombre;
    private String deporte;
    private String liga;
    private String equipoLocal;
    private String equipoVisitante;
    private LocalDateTime fechaInicio;
    private String estado;
}