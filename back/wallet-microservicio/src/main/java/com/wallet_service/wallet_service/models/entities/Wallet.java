package com.wallet_service.wallet_service.models.entities;

import java.util.Date;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "billetera")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_billetera;

    @Column(nullable = false)
    private int id_usuario;

    @Column(nullable = false)
    private double saldo;

    @Column(nullable = false)
    private double saldo_bloqueado;

    @Column(nullable = false, length = 10)
    private String moneda;

    @Column(nullable = false, length = 20)
    private String estado;

    @Column(nullable = false)
    private Date fecha_creacion;
}