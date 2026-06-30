package LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Services;

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

import LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Models.Entities.LimitesResponsables;
import LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Models.dto.LimitesResponsablesDTO;
import LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Repository.LimitesResponsablesRepository;

@ExtendWith(MockitoExtension.class)
public class LimitesResponsablesServicesTest {

    // Mockito: Al usar @Mock, le decimos al sistema que NO levante la base de datos completa.
    // En su lugar, Mockito crea una "clase de mentira" que intercepta las llamadas (como save, findAll) y responde al instante.
    @Mock
    private LimitesResponsablesRepository limitesRepository;

    // @InjectMocks agarra nuestra "clase de mentira" de arriba y la mete a la fuerza dentro del LimitesResponsablesServices.
    @InjectMocks
    private LimitesResponsablesServices limitesServices;

    private LimitesResponsables mockLimite;

    // ¿Qué hace @BeforeEach? Literalmente "Antes de cada uno". 
    // Es una función preparatoria. En vez de instanciar un límite falso y llenarlo de datos al principio de cada test...
    // Ponemos ese código repetitivo aquí y JUnit lo ejecuta automáticamente antes de iniciar cada @Test.
    @BeforeEach
    void setUp() {
        mockLimite = new LimitesResponsables();
        mockLimite.setIdLimite(1);
        mockLimite.setUsuariosIdUsuario(10);
        mockLimite.setLimiteDiario(100);
        mockLimite.setLimiteMensual(500);
    }

    @Test
    void testObtenerTodos() {
        // Arrange: Simulamos que la BD devuelve una lista con nuestro límite mockeado
        when(limitesRepository.findAll()).thenReturn(Arrays.asList(mockLimite));

        // Act: Ejecutamos el servicio
        List<LimitesResponsablesDTO> resultados = limitesServices.listarTodos();

        // Assert: Validamos los datos devueltos
        assertNotNull(resultados);
        assertEquals(1, resultados.size());
        assertEquals(10, resultados.get(0).getUsuariosIdUsuario());
        verify(limitesRepository, times(1)).findAll();
    }

    @Test
    void testEliminarLimite_NoExiste() {
        // Arrange: Simulamos que buscar el límite falso devuelve nulo
        when(limitesRepository.existsById(99)).thenReturn(false);

        // Act: Intentamos eliminar
        String resultado = limitesServices.eliminarLimite(99);

        // Assert: Validamos el mensaje
        assertEquals("Error: Límite no encontrado", resultado);
        verify(limitesRepository, never()).deleteById(99);
    }
}
