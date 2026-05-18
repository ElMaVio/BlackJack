package LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Models.requests;

import lombok.Data;

@Data
public class LimitesResponsablesActualizarRequests {
    private int idLimite;
    private int usuariosIdUsuario;
    private int limiteDiario;
    private int limiteMensual;
    private int montoApostadoDiario;
    private int montoApostadoMensual;
}