package juegos_microservicio.juegos_microservicio.Models.Entities;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;


@Entity
@Data
@Table(name= "juegos")
public class Juegos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idjuego;
    
    @Column(nullable = false)
    private String nombre;
    
    
    @Column(nullable = false)
    private String tipo;
    
    @Column(nullable = false)
    private String proveedor;
    
    @Column(nullable = false)
    private String estado;
}