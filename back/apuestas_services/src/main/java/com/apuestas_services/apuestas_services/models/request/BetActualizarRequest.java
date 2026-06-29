package com.apuestas_services.apuestas_services.models.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BetActualizarRequest {
    private int id_apuesta;
    private int id_usuario;
    private int id_billetera;
    private float monto_total;
    private float ganancia_potencial;
    private String tipo_apuesta;
    private String estado;
}