package eventos_microserevicios.eventos_microserevicios.Services;

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

import eventos_microserevicios.eventos_microserevicios.Models.Entities.Eventos;
import eventos_microserevicios.eventos_microserevicios.Models.dto.EventosDTO;
import eventos_microserevicios.eventos_microserevicios.Repository.EventosRepository;

@ExtendWith(MockitoExtension.class)
public class EventosServicesTest {

    @Mock
    private EventosRepository eventosRepository;

    @InjectMocks
    private EventosServices eventosServices;

    private Eventos mockEvento;

    @BeforeEach
    void setUp() {
        mockEvento = new Eventos();
        mockEvento.setIdEvento(1);
        mockEvento.setNombre("Partido Final");
        mockEvento.setDeporte("Fútbol");
        mockEvento.setEstado("Programado");
    }

    @Test
    void testObtenerTodos() {
        // Arrange: Simulamos que la base de datos devuelve una lista con nuestro evento mockeado
        when(eventosRepository.findAll()).thenReturn(Arrays.asList(mockEvento));

        // Act: Llamamos al método obtenerTodos del servicio
        List<EventosDTO> resultados = eventosServices.obtenerTodos();

        // Assert: Validamos que la lista no esté vacía y tenga el evento esperado
        assertNotNull(resultados);
        assertEquals(1, resultados.size());
        assertEquals("Partido Final", resultados.get(0).getNombre());
        verify(eventosRepository, times(1)).findAll();
    }

    @Test
    void testEliminarEvento_Existe() {
        // Arrange: Simulamos que el evento existe en la BD
        when(eventosRepository.existsById(1)).thenReturn(true);

        // Act: Intentamos eliminarlo
        String resultado = eventosServices.eliminarEvento(1);

        // Assert: Verificamos que el mensaje sea de éxito
        assertEquals("Evento eliminado exitosamente.", resultado);
        verify(eventosRepository, times(1)).deleteById(1);
    }
}
