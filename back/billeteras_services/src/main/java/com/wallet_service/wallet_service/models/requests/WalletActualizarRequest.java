package com.wallet_service.wallet_service.models.requests;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class WalletActualizarRequest {
    @JsonProperty("id_billetera")
    private int id_billetera;

    @JsonProperty("id_usuario")
    private int id_usuario;

    private double saldo;

    @JsonProperty("saldo_bloqueado")
    private double saldo_bloqueado;

    private String moneda;
    private String estado;
}