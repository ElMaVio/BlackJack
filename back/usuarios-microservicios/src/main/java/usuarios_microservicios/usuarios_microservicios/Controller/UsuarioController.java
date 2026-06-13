package usuarios_microservicios.usuarios_microservicios.Controller;

import usuarios_microservicios.usuarios_microservicios.Models.dto.UsuarioDTO;
import usuarios_microservicios.usuarios_microservicios.Models.requests.UsuarioRequest;
import usuarios_microservicios.usuarios_microservicios.Models.requests.UsuarioActualizarRequest;
import usuarios_microservicios.usuarios_microservicios.Services.UsuarioService;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RequestMapping("/usuario")
@RestController
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("")
    public List<UsuarioDTO> obtenerTodosUsuarios() {
        return usuarioService.listarUsuarios();
    }

    @PostMapping("/crear")
    public UsuarioDTO agregarUsuario(@RequestBody UsuarioRequest usuarioNuevo) {
        return usuarioService.agregarUsuario(usuarioNuevo);
    }

    @PutMapping("/actualizar")
    public UsuarioDTO actualizarUsuario(@RequestBody UsuarioActualizarRequest usuarioEditado) {
        return usuarioService.actualizarUsuario(usuarioEditado);
    }

    @DeleteMapping("/eliminar/{idUsuario}")
    public String eliminarUsuario(@PathVariable int idUsuario) {
        return usuarioService.eliminarUsuario(idUsuario);
    }

    @GetMapping("/{idUsuario}")
    public UsuarioDTO obtenerUsuarioPorId(@PathVariable int idUsuario) {
        return usuarioService.obtenerUsuarioPorId(idUsuario);
    }
}