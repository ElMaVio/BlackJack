package com.apuestas_services.apuestas_services.models.dto;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalletDto {
    private int id_billetera;
    private int id_usuario;
    private float saldo;
    private float saldo_bloqueado;
    private String moneda;
    private String estado;
    private Date fecha_creacion;
}