package com.wallet_service.wallet_service.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.wallet_service.wallet_service.models.entities.Wallet;
import com.wallet_service.wallet_service.models.requests.WalletActualizarRequest;
import com.wallet_service.wallet_service.models.requests.WalletRequest;
import com.wallet_service.wallet_service.services.WalletService;

@RestController
@RequestMapping("/wallet")
@CrossOrigin(origins = "*")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @GetMapping
    public List<Wallet> getAll() {
        return walletService.listarBilleteras();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Wallet> getById(@PathVariable int id) {
        Wallet w = walletService.obtenerPorId(id);
        return w != null ? ResponseEntity.ok(w) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Wallet create(@RequestBody WalletRequest request) {
        return walletService.crearBilletera(request);
    }

    @PutMapping
    public Wallet update(@RequestBody WalletActualizarRequest request) {
        return walletService.actualizarBilletera(request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable int id) {
        walletService.eliminarBilletera(id);
        // Devolvemos un JSON limpio para que Angular .delete<any> no falle al parsear letras
        return ResponseEntity.ok(Map.of("message", "Billetera eliminada con exito"));
    }
}