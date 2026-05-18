package LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Models.requests;

import lombok.Data;

@Data
public class LimitesResponsablesRequests {
    private int usuariosIdUsuario;
    private int limiteDiario;
    private int limiteMensual;
    private int montoApostadoDiario;
    private int montoApostadoMensual;
}