package com.apuestas_services.apuestas_services.models.entities;


import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "Apuesta")
public class Bet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_apuesta;

    @Column(nullable = false)
    private int id_usuario;

    @Column(nullable = false)
    private int id_billetera;

    @Column(nullable = false)
    private float monto_total;

    @Column(nullable = false)
    private float ganancia_potencial;

    @Column(nullable = false)
    private String tipo_apuesta;

    @Column(nullable = false)
    private String estado;

    @Column(nullable = false)
    private Date fecha_creacion;

    @Column(nullable = true)
    private Date fecha_resolucion;


}