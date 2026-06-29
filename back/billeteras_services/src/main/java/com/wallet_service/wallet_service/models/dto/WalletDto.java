package com.wallet_service.wallet_service.models.dto;

import lombok.Data;
import java.util.Date;

@Data
public class WalletDto {
    private int id_billetera;
    private int id_usuario;
    private double saldo;
    private double saldo_bloqueado;
    private String moneda;
    private String estado;
    private Date fecha_creacion;
}
