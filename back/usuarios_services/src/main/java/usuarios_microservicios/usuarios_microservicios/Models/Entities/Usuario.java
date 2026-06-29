package usuarios_microservicios.usuarios_microservicios.Models.Entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Usuario") // Nombre exacto de tu tabla en MySQL
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_usuario;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

   
    private String password_hash;

    @Column(nullable = false)
    private String rol;

    @Column(nullable = false)
    private String estado;
}
