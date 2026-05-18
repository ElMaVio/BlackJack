package com.apuestas_services.apuestas_services.repositories;

import com.apuestas_services.apuestas_services.models.entities.Bet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BetRepository extends JpaRepository<Bet,Integer> {

}