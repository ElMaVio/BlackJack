package juegos_microservicio.juegos_microservicio.Models.requests;

import lombok.Data;

@Data
public class JuegosRequests {
    private String nombre;
    private String tipo;
    private String proveedor;
    private String estado;
}