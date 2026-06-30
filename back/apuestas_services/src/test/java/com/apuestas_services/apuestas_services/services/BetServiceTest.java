package com.apuestas_services.apuestas_services.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.apuestas_services.apuestas_services.models.entities.Bet;
import com.apuestas_services.apuestas_services.models.dto.BetDto;
import com.apuestas_services.apuestas_services.repositories.BetRepository;

@ExtendWith(MockitoExtension.class)
public class BetServiceTest {

    // @Mock se usa gracias a la librería 'Mockito'. 
    // ¿Por qué usamos Mockito? Porque en las Pruebas Unitarias NO queremos conectarnos a la base de datos real.
    // @Mock crea un "simulador" o "doble de riesgo" del repositorio. Si el servicio le pide datos, este simulador responde con datos falsos preconfigurados.
    @Mock
    private BetRepository betRepository;

    // @InjectMocks toma el simulador que creamos arriba y se lo inyecta a nuestro servicio real.
    // Así, probamos que la lógica del servicio funcione sin tocar la BD.
    @InjectMocks
    private BetService betService;

    private Bet mockBet;

    // @BeforeEach significa "Antes de cada test". 
    // Se ejecuta automáticamente antes de que empiece cada prueba (@Test).
    // Lo usamos para preparar los datos iniciales, así no tenemos que repetir este código en cada prueba.
    @BeforeEach
    void setUp() {
        mockBet = new Bet();
        mockBet.setId_apuesta(1);
        mockBet.setId_usuario(10);
        mockBet.setMonto_total(500.0f);
        mockBet.setEstado("pendiente");
    }

    @Test
    void testObtenerBetPorId() {
        // Arrange: Preparamos el entorno simulando que la base de datos encuentra la apuesta con ID 1
        when(betRepository.findById(1)).thenReturn(Optional.of(mockBet));

        // Act: Ejecutamos el método del servicio que queremos probar
        BetDto resultado = betService.obtenerBetPorId(1);

        // Assert: Verificamos que los datos devueltos coinciden con nuestra simulación
        assertNotNull(resultado);
        assertEquals(1, resultado.getId_apuesta());
        assertEquals(500.0f, resultado.getMonto_total());
        verify(betRepository, times(1)).findById(1);
    }

    @Test
    void testListarApuestas() {
        // Arrange: Simulamos que la base de datos devuelve una lista con nuestra apuesta mockeada
        when(betRepository.findAll()).thenReturn(Arrays.asList(mockBet));

        // Act: Llamamos al método listarApuestas del servicio
        List<BetDto> resultados = betService.listarApuestas();

        // Assert: Validamos que la lista no esté vacía y tenga la apuesta esperada
        assertNotNull(resultados);
        assertEquals(1, resultados.size());
        assertEquals("pendiente", resultados.get(0).getEstado());
        verify(betRepository, times(1)).findAll();
    }
}
