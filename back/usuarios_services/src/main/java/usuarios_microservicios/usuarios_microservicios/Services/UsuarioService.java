package usuarios_microservicios.usuarios_microservicios.Services;

import usuarios_microservicios.usuarios_microservicios.Models.Entities.Usuario;
import usuarios_microservicios.usuarios_microservicios.Models.dto.UsuarioDTO;
import usuarios_microservicios.usuarios_microservicios.Models.requests.UsuarioRequest;
import usuarios_microservicios.usuarios_microservicios.Models.requests.UsuarioActualizarRequest;
import usuarios_microservicios.usuarios_microservicios.Repository.UsuarioRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // GET - Listar todos (Solo ADMIN)
    public List<UsuarioDTO> listarUsuarios(String rolSolicitante) {
        if (!"ADMIN".equalsIgnoreCase(rolSolicitante)) {
            throw new RuntimeException("Acceso denegado: Se requiere rol ADMIN para ver todos los usuarios.");
        }
        return usuarioRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // POST - Agregar nuevo
    public UsuarioDTO agregarUsuario(UsuarioRequest usuarioNuevo) {
        Usuario usuario = new Usuario();
        usuario.setUsername(usuarioNuevo.getUsername());
        usuario.setEmail(usuarioNuevo.getEmail());
        usuario.setPassword_hash(usuarioNuevo.getPassword_hash());
        
        String rol = usuarioNuevo.getRol();
        if (rol == null || rol.trim().isEmpty()) {
            rol = "USER"; // Rol por defecto
        }
        usuario.setRol(rol.toUpperCase());
        
        usuario.setEstado(usuarioNuevo.getEstado());
        Usuario guardado = usuarioRepository.save(usuario);
        return mapToDTO(guardado);
    }

    // PUT - Actualizar existente
    public UsuarioDTO actualizarUsuario(UsuarioActualizarRequest usuarioEditado) {
        Usuario usuario = usuarioRepository.findById(usuarioEditado.getId_usuario()).orElse(null);
        if (usuario != null) {
            usuario.setUsername(usuarioEditado.getUsername());
            usuario.setEmail(usuarioEditado.getEmail());
            usuario.setPassword_hash(usuarioEditado.getPassword_hash());
            usuario.setRol(usuarioEditado.getRol());
            usuario.setEstado(usuarioEditado.getEstado());
            Usuario guardado = usuarioRepository.save(usuario);
            return mapToDTO(guardado);
        }
        return null;
    }

    // DELETE - Eliminar por ID (Solo ADMIN)
    public String eliminarUsuario(int idUsuario, String rolSolicitante) {
        if (!"ADMIN".equalsIgnoreCase(rolSolicitante)) {
            return "Acceso denegado: Solo los administradores pueden eliminar usuarios.";
        }
        if (usuarioRepository.existsById(idUsuario)) {
            usuarioRepository.deleteById(idUsuario);
            return "Usuario eliminado correctamente.";
        }
        return "El usuario no existe.";
    }

    // GET - Buscar por ID
    public UsuarioDTO obtenerUsuarioPorId(int idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElse(null);
        return usuario != null ? mapToDTO(usuario) : null;
    }

    private UsuarioDTO mapToDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId_usuario(usuario.getId_usuario());
        dto.setUsername(usuario.getUsername());
        dto.setEmail(usuario.getEmail());
        dto.setRol(usuario.getRol());
        dto.setEstado(usuario.getEstado());
        return dto;
    }
}