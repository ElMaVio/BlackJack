package eventos_microserevicios.eventos_microserevicios.Models.Entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "eventos")
public class Eventos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idEvento;

    private String nombre;

    private String deporte;

    private String liga;

    private String equipoLocal;

    private String equipoVisitante;

    private LocalDateTime fechaInicio;

    private String estado;
}