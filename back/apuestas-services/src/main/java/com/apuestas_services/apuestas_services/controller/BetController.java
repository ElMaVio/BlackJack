package com.apuestas_services.apuestas_services.controller;

import com.apuestas_services.apuestas_services.models.entities.Bet;
import com.apuestas_services.apuestas_services.models.request.BetRequest;
import com.apuestas_services.apuestas_services.models.request.BetActualizarRequest;
import com.apuestas_services.apuestas_services.services.BetService;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/apuestas")
public class BetController {

    @Autowired
    private BetService betService;

    // GET
    @GetMapping("")
    public List<Bet> obtenerTodasApuestas() {
        return betService.listarApuestas();
    }

    // POST
    @PostMapping("")
    public Bet agregarApuesta(@RequestBody BetRequest apuestaNueva) {
        return betService.agregarBet(apuestaNueva);
    }

    // PUT
    @PutMapping("")
    public Bet actualizarApuesta(@RequestBody BetActualizarRequest apuestaEditada) {
        return betService.actualizarBet(apuestaEditada);
    }

    // DELETE
    @DeleteMapping("/{idBet}")
    public String eliminarApuesta(@PathVariable int idBet) {
        return betService.eliminarBet(idBet);
    }

    // GET
    @GetMapping("/{idBet}")
    public Bet obtenerApuestaPorId(@PathVariable int idBet) {
        return betService.obtenerBetPorId(idBet);
    }
}