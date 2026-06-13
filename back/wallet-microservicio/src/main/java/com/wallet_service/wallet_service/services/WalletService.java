package com.wallet_service.wallet_service.services;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.wallet_service.wallet_service.models.entities.Wallet;
import com.wallet_service.wallet_service.models.dto.WalletDto;
import com.wallet_service.wallet_service.models.requests.WalletActualizarRequest;
import com.wallet_service.wallet_service.models.requests.WalletRequest;
import com.wallet_service.wallet_service.repositories.WalletRepository;
import java.util.stream.Collectors;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    // 1. READ ALL
    public List<WalletDto> listarBilleteras() {
        return walletRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // 2. READ BY ID
    public WalletDto obtenerPorId(int idBilletera) {
        Wallet w = walletRepository.findById(idBilletera).orElse(null);
        return w != null ? mapToDTO(w) : null;
    }

    // 3. CREATE
    public WalletDto crearBilletera(WalletRequest request) {
        Wallet wallet = new Wallet();
        wallet.setId_usuario(request.getId_usuario());
        wallet.setSaldo(request.getSaldo());
        wallet.setSaldo_bloqueado(request.getSaldo_bloqueado());
        wallet.setMoneda(request.getMoneda());
        wallet.setEstado(request.getEstado() != null ? request.getEstado() : "activo");
        wallet.setFecha_creacion(new Date()); // Se asigna la fecha actual automáticamente

        Wallet guardado = walletRepository.save(wallet);
        return mapToDTO(guardado);
    }

    // 4. UPDATE
    public WalletDto actualizarBilletera(WalletActualizarRequest request) {
        Wallet existe = walletRepository.findById(request.getId_billetera()).orElse(null);
        if (existe == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Billetera no encontrada.");
        }

        existe.setId_usuario(request.getId_usuario());
        existe.setSaldo(request.getSaldo());
        existe.setSaldo_bloqueado(request.getSaldo_bloqueado());
        existe.setMoneda(request.getMoneda());
        existe.setEstado(request.getEstado());

        Wallet guardado = walletRepository.save(existe);
        return mapToDTO(guardado);
    }

    // 5. DELETE
    public void eliminarBilletera(int idBilletera) {
        Wallet existe = walletRepository.findById(idBilletera).orElse(null);
        if (existe == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Billetera no encontrada.");
        }
        walletRepository.deleteById(idBilletera);
    }

    private WalletDto mapToDTO(Wallet w) {
        WalletDto dto = new WalletDto();
        dto.setId_billetera(w.getId_billetera());
        dto.setId_usuario(w.getId_usuario());
        dto.setSaldo(w.getSaldo());
        dto.setSaldo_bloqueado(w.getSaldo_bloqueado());
        dto.setMoneda(w.getMoneda());
        dto.setEstado(w.getEstado());
        dto.setFecha_creacion(w.getFecha_creacion());
        return dto;
    }
}