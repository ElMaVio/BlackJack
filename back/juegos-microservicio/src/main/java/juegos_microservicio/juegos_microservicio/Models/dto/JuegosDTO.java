package juegos_microservicio.juegos_microservicio.Models.dto;

import lombok.Data;

@Data
public class JuegosDTO {
    private int idjuego;
    private String nombre;
    private String tipo;
    private String proveedor;
    private String estado;
}