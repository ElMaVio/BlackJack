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
import juegos_microservicio.juegos_microservicio.Repository.JuegoRepository;

@ExtendWith(MockitoExtension.class)
public class JuegosServicesTest {

    // USAMOS MOCKITO (@Mock) PARA NO TOCAR LA BASE DE DATOS REAL DURANTE LAS PRUEBAS.
    // Esto crea un repositorio falso en la memoria que responde rápido sin necesidad de una BD corriendo.
    @Mock
    private JuegoRepository juegosRepository;

    // @InjectMocks inyecta el repositorio falso (mock) dentro del servicio real que vamos a probar.
    @InjectMocks
    private JuegosServices juegosServices;

    private Juegos mockJuego;

    // @BeforeEach ("Antes de cada uno")
    // Este código se repite mágicamente antes de que se ejecute cada método @Test.
    // Lo usamos para instanciar el 'juego de prueba' vacío y prepararlo, evitando copiar y pegar el mismo código en cada test.
    @BeforeEach
    void setUp() {
        mockJuego = new Juegos();
        mockJuego.setIdjuego(1);
        mockJuego.setNombre("BlackJack Clásico");
        mockJuego.setTipo("Cartas");
        mockJuego.setEstado("ACTIVO");
    }

    @Test
    void testListarJuegos() {
        // Arrange: Simulamos que la base de datos devuelve nuestra lista de juegos
        when(juegosRepository.findAll()).thenReturn(Arrays.asList(mockJuego));

        // Act: Ejecutamos el servicio
        List<JuegosDTO> resultados = juegosServices.obtenerTodosLosJuegos();

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
        boolean resultado = juegosServices.eliminarJuego(99);

        // Assert: Validamos mensaje de error
        assertFalse(resultado);
        verify(juegosRepository, never()).deleteById(99);
    }
}
