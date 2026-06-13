package usuarios_microservicios.usuarios_microservicios.Services;

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

import usuarios_microservicios.usuarios_microservicios.Models.Entities.Usuario;
import usuarios_microservicios.usuarios_microservicios.Repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario mockUsuario;

    @BeforeEach
    void setUp() {
        mockUsuario = new Usuario();
        mockUsuario.setId_usuario(1);
        mockUsuario.setUsername("testuser");
        mockUsuario.setEmail("test@test.com");
    }

    @Test
    void testListarUsuarios() {
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(mockUsuario));

        List<Usuario> resultados = usuarioService.listarUsuarios();

        assertNotNull(resultados);
        assertEquals(1, resultados.size());
        assertEquals("testuser", resultados.get(0).getUsername());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    void testObtenerUsuarioPorId() {
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(mockUsuario));

        Usuario resultado = usuarioService.obtenerUsuarioPorId(1);

        assertNotNull(resultado);
        assertEquals("test@test.com", resultado.getEmail());
        verify(usuarioRepository, times(1)).findById(1);
    }
}
