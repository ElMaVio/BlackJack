package com.wallet_service.wallet_service.repositories;


import com.wallet_service.wallet_service.models.entities.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository extends JpaRepository<Wallet,Integer> {
}

