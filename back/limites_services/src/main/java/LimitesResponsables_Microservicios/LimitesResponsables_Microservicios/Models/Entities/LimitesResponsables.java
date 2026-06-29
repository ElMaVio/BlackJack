package LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Models.Entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "limites_responsables")
public class LimitesResponsables {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idLimite;

    @Column(nullable = false)
    private int usuariosIdUsuario;

    @Column(nullable = false)
    private int limiteDiario;

    @Column(nullable = false)
    private int limiteMensual;

    @Column(nullable = false)
    private int montoApostadoDiario;

    @Column(nullable = false)
    private int montoApostadoMensual;

    @Column(nullable = false)
    private LocalDateTime fechaActualizacion;
}