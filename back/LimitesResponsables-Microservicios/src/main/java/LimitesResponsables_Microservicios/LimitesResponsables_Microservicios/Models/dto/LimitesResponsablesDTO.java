package LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Models.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LimitesResponsablesDTO {
    private int idLimite;
    private int usuariosIdUsuario;
    private int limiteDiario;
    private int limiteMensual;
    private int montoApostadoDiario;
    private int montoApostadoMensual;
    private LocalDateTime fechaActualizacion;
}