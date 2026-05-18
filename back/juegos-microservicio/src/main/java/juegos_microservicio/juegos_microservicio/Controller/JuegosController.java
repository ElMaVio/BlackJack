package juegos_microservicio.juegos_microservicio.Controller;

import juegos_microservicio.juegos_microservicio.Models.dto.JuegosDTO;
import juegos_microservicio.juegos_microservicio.Models.requests.JuegosRequests;
import juegos_microservicio.juegos_microservicio.Models.requests.JuegosRequestsActualizar;
import juegos_microservicio.juegos_microservicio.Services.JuegosServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/juegos")
@CrossOrigin(origins = "http://localhost:4200") // 👈 Permite la comunicación directa con tu frontend en Angular
public class JuegosController {

    @Autowired
    private JuegosServices juegosServices;

    // 1. LISTAR TODOS LOS JUEGOS
    @GetMapping
    public ResponseEntity<List<JuegosDTO>> listarJuegos() {
        List<JuegosDTO> juegos = juegosServices.obtenerTodosLosJuegos();
        return ResponseEntity.ok(juegos);
    }

    // 2. CREAR UN NUEVO JUEGO
    @PostMapping("/crear")
    public ResponseEntity<JuegosDTO> crearJuego(@RequestBody JuegosRequests request) {
        JuegosDTO nuevoJuego = juegosServices.crearJuego(request);
        return ResponseEntity.ok(nuevoJuego);
    }

    // 3. ACTUALIZAR UN JUEGO EXISTENTE
    @PutMapping("/actualizar")
    public ResponseEntity<JuegosDTO> actualizarJuego(@RequestBody JuegosRequestsActualizar request) {
        JuegosDTO actualizado = juegosServices.actualizarJuego(request);
        if (actualizado != null) {
            return ResponseEntity.ok(actualizado);
        }
        return ResponseEntity.notFound().build();
    }

    // 4. ELIMINAR UN JUEGO POR ID
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarJuego(@PathVariable int id) {
        boolean eliminado = juegosServices.eliminarJuego(id);
        if (eliminado) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}