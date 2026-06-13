package com.wallet_service.wallet_service.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.wallet_service.wallet_service.models.entities.Wallet;
import com.wallet_service.wallet_service.repositories.WalletRepository;

@ExtendWith(MockitoExtension.class)
public class WalletServiceTest {

    @Mock
    private WalletRepository walletRepository;

    @InjectMocks
    private WalletService walletService;

    private Wallet mockWallet;

    @BeforeEach
    void setUp() {
        mockWallet = new Wallet();
        mockWallet.setId_billetera(1);
        mockWallet.setId_usuario(1);
        mockWallet.setSaldo(100.0);
        mockWallet.setMoneda("USD");
    }

    @Test
    void testObtenerPorId_Existe() {
        when(walletRepository.findById(1)).thenReturn(Optional.of(mockWallet));

        Wallet resultado = walletService.obtenerPorId(1);

        assertNotNull(resultado);
        assertEquals(1, resultado.getId_billetera());
        assertEquals("USD", resultado.getMoneda());
        verify(walletRepository, times(1)).findById(1);
    }

    @Test
    void testObtenerPorId_NoExiste() {
        when(walletRepository.findById(99)).thenReturn(Optional.empty());

        Wallet resultado = walletService.obtenerPorId(99);

        assertNull(resultado);
        verify(walletRepository, times(1)).findById(99);
    }
}
