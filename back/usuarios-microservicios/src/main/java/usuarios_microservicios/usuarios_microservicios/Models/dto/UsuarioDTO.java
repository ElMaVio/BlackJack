package usuarios_microservicios.usuarios_microservicios.Models.dto;

import lombok.Data;

@Data
public class UsuarioDTO {
    private int id_usuario;
    private String username;
    private String email;
    private String rol;
    private String estado;
}
