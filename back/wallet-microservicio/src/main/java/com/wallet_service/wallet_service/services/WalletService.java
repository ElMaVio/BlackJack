package com.wallet_service.wallet_service.services;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.wallet_service.wallet_service.models.entities.Wallet;
import com.wallet_service.wallet_service.models.requests.WalletActualizarRequest;
import com.wallet_service.wallet_service.models.requests.WalletRequest;
import com.wallet_service.wallet_service.repositories.WalletRepository;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    // 1. READ ALL
    public List<Wallet> listarBilleteras() {
        return walletRepository.findAll();
    }

    // 2. READ BY ID
    public Wallet obtenerPorId(int idBilletera) {
        return walletRepository.findById(idBilletera).orElse(null);
    }

    // 3. CREATE
    public Wallet crearBilletera(WalletRequest request) {
        Wallet wallet = new Wallet();
        wallet.setId_usuario(request.getId_usuario());
        wallet.setSaldo(request.getSaldo());
        wallet.setSaldo_bloqueado(request.getSaldo_bloqueado());
        wallet.setMoneda(request.getMoneda());
        wallet.setEstado(request.getEstado() != null ? request.getEstado() : "activo");
        wallet.setFecha_creacion(new Date()); // Se asigna la fecha actual automáticamente

        return walletRepository.save(wallet);
    }

    // 4. UPDATE
    public Wallet actualizarBilletera(WalletActualizarRequest request) {
        Wallet existe = walletRepository.findById(request.getId_billetera()).orElse(null);
        if (existe == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Billetera no encontrada.");
        }

        existe.setId_usuario(request.getId_usuario());
        existe.setSaldo(request.getSaldo());
        existe.setSaldo_bloqueado(request.getSaldo_bloqueado());
        existe.setMoneda(request.getMoneda());
        existe.setEstado(request.getEstado());

        return walletRepository.save(existe);
    }

    // 5. DELETE
    public void eliminarBilletera(int idBilletera) {
        Wallet existe = walletRepository.findById(idBilletera).orElse(null);
        if (existe == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Billetera no encontrada.");
        }
        walletRepository.deleteById(idBilletera);
    }
}