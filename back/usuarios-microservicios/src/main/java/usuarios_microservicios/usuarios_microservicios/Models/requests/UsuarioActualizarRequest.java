package usuarios_microservicios.usuarios_microservicios.Models.requests;

import lombok.Data;

@Data
public class UsuarioActualizarRequest {
    private int id_usuario;
    private String username;
    private String email;
    private String password_hash;
    private String rol;
    private String estado;
}
