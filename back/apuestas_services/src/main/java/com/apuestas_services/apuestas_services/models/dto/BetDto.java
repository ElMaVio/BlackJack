package com.apuestas_services.apuestas_services.models.dto;

import lombok.Data;
import java.util.Date;

@Data
public class BetDto {
    private int id_apuesta;
    private int id_usuario;
    private int id_billetera;
    private float monto_total;
    private float ganancia_potencial;
    private String tipo_apuesta;
    private String estado;
    private Date fecha_creacion;
    private Date fecha_resolucion;
}
