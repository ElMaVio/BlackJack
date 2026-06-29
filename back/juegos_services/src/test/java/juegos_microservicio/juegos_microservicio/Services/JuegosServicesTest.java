package juegos_microservicio.juegos_microservicio.Services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import juegos_microservicio.juegos_microservicio.Models.Entities.Juegos;
import juegos_microservicio.juegos_microservicio.Models.dto.JuegosDTO;
import juegos_microservicio.juegos_microservicio.Repository.JuegosRepository;

@ExtendWith(MockitoExtension.class)
public class JuegosServicesTest {

    @Mock
    private JuegosRepository juegosRepository;

    @InjectMocks
    private JuegosServices juegosServices;

    private Juegos mockJuego;

    @BeforeEach
    void setUp() {
        mockJuego = new Juegos();
        mockJuego.setId_juegos(1);
        mockJuego.setNombre("BlackJack Clásico");
        mockJuego.setTipo("Cartas");
        mockJuego.setReglas("Llegar a 21 sin pasarse");
    }

    @Test
    void testListarJuegos() {
        // Arrange: Simulamos que la base de datos devuelve nuestra lista de juegos
        when(juegosRepository.findAll()).thenReturn(Arrays.asList(mockJuego));

        // Act: Ejecutamos el servicio
        List<JuegosDTO> resultados = juegosServices.listarJuegos();

        // Assert: Validamos los datos devueltos
        assertNotNull(resultados);
        assertEquals(1, resultados.size());
        assertEquals("BlackJack Clásico", resultados.get(0).getNombre());
        verify(juegosRepository, times(1)).findAll();
    }

    @Test
    void testEliminarJuego_NoExiste() {
        // Arrange: Simulamos que el juego no existe
        when(juegosRepository.existsById(99)).thenReturn(false);

        // Act: Intentamos eliminar
        String resultado = juegosServices.eliminarJuego(99);

        // Assert: Validamos mensaje de error
        assertEquals("El juego no existe.", resultado);
        verify(juegosRepository, never()).deleteById(99);
    }
}
