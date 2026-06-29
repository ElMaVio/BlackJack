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

    @Mock
    private LimitesResponsablesRepository limitesRepository;

    @InjectMocks
    private LimitesResponsablesServices limitesServices;

    private LimitesResponsables mockLimite;

    @BeforeEach
    void setUp() {
        mockLimite = new LimitesResponsables();
        mockLimite.setId_limite(1);
        mockLimite.setId_usuario(10);
        mockLimite.setLimite_diario(100.0);
        mockLimite.setLimite_semanal(500.0);
    }

    @Test
    void testObtenerTodos() {
        // Arrange: Simulamos que la BD devuelve una lista con nuestro límite mockeado
        when(limitesRepository.findAll()).thenReturn(Arrays.asList(mockLimite));

        // Act: Ejecutamos el servicio
        List<LimitesResponsablesDTO> resultados = limitesServices.obtenerTodos();

        // Assert: Validamos los datos devueltos
        assertNotNull(resultados);
        assertEquals(1, resultados.size());
        assertEquals(10, resultados.get(0).getId_usuario());
        verify(limitesRepository, times(1)).findAll();
    }

    @Test
    void testEliminarLimite_NoExiste() {
        // Arrange: Simulamos que buscar el límite falso devuelve nulo
        when(limitesRepository.existsById(99)).thenReturn(false);

        // Act: Intentamos eliminar
        String resultado = limitesServices.eliminarLimite(99);

        // Assert: Validamos el mensaje
        assertEquals("El límite responsable no existe.", resultado);
        verify(limitesRepository, never()).deleteById(99);
    }
}
