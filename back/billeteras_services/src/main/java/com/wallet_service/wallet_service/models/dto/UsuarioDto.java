package com.wallet_service.wallet_service.models.dto;

import lombok.Data;

@Data
public class UsuarioDto {
    private int id_usuario;
    private String username;
    private String email;
    private String estado;
    private String rol;
}