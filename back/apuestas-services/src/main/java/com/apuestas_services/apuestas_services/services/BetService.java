package com.apuestas_services.apuestas_services.services;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import com.apuestas_services.apuestas_services.models.entities.Bet;
import com.apuestas_services.apuestas_services.models.dto.BetDto;
import com.apuestas_services.apuestas_services.models.dto.WalletDto;
import com.apuestas_services.apuestas_services.models.request.BetActualizarRequest;
import com.apuestas_services.apuestas_services.models.request.BetRequest;
import com.apuestas_services.apuestas_services.repositories.BetRepository;
import java.util.stream.Collectors;
import com.apuestas_services.apuestas_services.models.request.BetActualizarRequest;
import com.apuestas_services.apuestas_services.models.request.BetRequest;
import com.apuestas_services.apuestas_services.repositories.BetRepository;

@Service
public class BetService {

    @Autowired
    private BetRepository betRepository;

    @Autowired
    private WebClient webClient;

    // 1. Obtener una apuesta específica por su ID
    public BetDto obtenerBetPorId(int idBet) {
        Bet b = betRepository.findById(idBet).orElse(null);
        return b != null ? mapToDTO(b) : null;
    }

    // 2. Listar todas las apuestas registradas en el sistema
    public List<BetDto> listarApuestas() {
        return betRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // 3. Agregar una nueva apuesta validando fondos mediante WebClient
    public BetDto agregarBet(BetRequest betNuevo) {
        WalletDto wallet = null;

        try {
            wallet = webClient.get()
                    .uri("/wallet/{idBilletera}", betNuevo.getId_billetera()) // Con el / inicial asegurado
                    .retrieve()
                    .bodyToMono(WalletDto.class)
                    .block();
        } catch (WebClientResponseException e) {
            throw new ResponseStatusException(HttpStatus.valueOf(e.getStatusCode().value()),
                    "Error al validar la billetera: " + e.getStatusText());
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Error de conexion con el servicio de Wallet: " + e.getMessage());
        }

        if (wallet == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "La billetera especificada no existe.");
        }

        if (wallet.getSaldo() < betNuevo.getMonto_total()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Saldo insuficiente para realizar la apuesta.");
        }

        Bet bet = new Bet();
        bet.setId_usuario(betNuevo.getId_usuario());
        bet.setId_billetera(betNuevo.getId_billetera());
        bet.setMonto_total(betNuevo.getMonto_total());
        bet.setGanancia_potencial(betNuevo.getGanancia_potencial());
        bet.setTipo_apuesta(betNuevo.getTipo_apuesta());
        bet.setEstado(betNuevo.getEstado());
        bet.setFecha_creacion(new Date());

        Bet guardado = betRepository.save(bet);
        return mapToDTO(guardado);
    }

    // 4. Actualizar una apuesta existente (Resolver estado)
    public BetDto actualizarBet(BetActualizarRequest betEditado) {
        Bet betExiste = betRepository.findById(betEditado.getId_apuesta()).orElse(null);
        if (betExiste == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Apuesta no encontrada.");
        }

        betExiste.setId_usuario(betEditado.getId_usuario());
        betExiste.setId_billetera(betEditado.getId_billetera());
        betExiste.setMonto_total(betEditado.getMonto_total());
        betExiste.setGanancia_potencial(betEditado.getGanancia_potencial());
        betExiste.setTipo_apuesta(betEditado.getTipo_apuesta());
        betExiste.setEstado(betEditado.getEstado());

        if (betEditado.getEstado() != null && !betEditado.getEstado().equalsIgnoreCase("pendiente")) {
            betExiste.setFecha_resolucion(new Date());
        }

        Bet guardado = betRepository.save(betExiste);
        return mapToDTO(guardado);
    }

    // 5. Eliminar registro
    public String eliminarBet(int idBet) {
        Bet betExiste = betRepository.findById(idBet).orElse(null);
        if (betExiste == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Apuesta no encontrada.");
        }

        betRepository.deleteById(idBet);
        return "Apuesta eliminada con éxito!";
    }

    private BetDto mapToDTO(Bet b) {
        BetDto dto = new BetDto();
        dto.setId_apuesta(b.getId_apuesta());
        dto.setId_usuario(b.getId_usuario());
        dto.setId_billetera(b.getId_billetera());
        dto.setMonto_total(b.getMonto_total());
        dto.setGanancia_potencial(b.getGanancia_potencial());
        dto.setTipo_apuesta(b.getTipo_apuesta());
        dto.setEstado(b.getEstado());
        dto.setFecha_creacion(b.getFecha_creacion());
        dto.setFecha_resolucion(b.getFecha_resolucion());
        return dto;
    }
}