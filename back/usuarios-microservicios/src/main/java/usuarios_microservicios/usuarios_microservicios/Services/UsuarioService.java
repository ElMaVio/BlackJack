package usuarios_microservicios.usuarios_microservicios.Services;

import usuarios_microservicios.usuarios_microservicios.Models.Entities.Usuario;
import usuarios_microservicios.usuarios_microservicios.Models.requests.UsuarioRequest;
import usuarios_microservicios.usuarios_microservicios.Models.requests.UsuarioActualizarRequest;
import usuarios_microservicios.usuarios_microservicios.Repository.UsuarioRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // GET - Listar todos
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // POST - Agregar nuevo
    public Usuario agregarUsuario(UsuarioRequest usuarioNuevo) {
        Usuario usuario = new Usuario();
        usuario.setUsername(usuarioNuevo.getUsername());
        usuario.setEmail(usuarioNuevo.getEmail());
        usuario.setPassword_hash(usuarioNuevo.getPassword_hash());
        usuario.setRol(usuarioNuevo.getRol());
        usuario.setEstado(usuarioNuevo.getEstado());
        return usuarioRepository.save(usuario);
    }

    // PUT - Actualizar existente
    public Usuario actualizarUsuario(UsuarioActualizarRequest usuarioEditado) {
        Usuario usuario = usuarioRepository.findById(usuarioEditado.getId_usuario()).orElse(null);
        if (usuario != null) {
            usuario.setUsername(usuarioEditado.getUsername());
            usuario.setEmail(usuarioEditado.getEmail());
            usuario.setPassword_hash(usuarioEditado.getPassword_hash());
            usuario.setRol(usuarioEditado.getRol());
            usuario.setEstado(usuarioEditado.getEstado());
            return usuarioRepository.save(usuario);
        }
        return null;
    }

    // DELETE - Eliminar por ID
    public String eliminarUsuario(int idUsuario) {
        if (usuarioRepository.existsById(idUsuario)) {
            usuarioRepository.deleteById(idUsuario);
            return "Usuario eliminado correctamente.";
        }
        return "El usuario no existe.";
    }

    // GET - Buscar por ID
    public Usuario obtenerUsuarioPorId(int idUsuario) {
        return usuarioRepository.findById(idUsuario).orElse(null);
    }
}