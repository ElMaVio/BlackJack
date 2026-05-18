package eventos_microserevicios.eventos_microserevicios.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import eventos_microserevicios.eventos_microserevicios.Models.dto.EventosDTO;
import eventos_microserevicios.eventos_microserevicios.Models.requests.EventosActualizarRequests;
import eventos_microserevicios.eventos_microserevicios.Models.requests.EventosRequests;
import eventos_microserevicios.eventos_microserevicios.Services.EventosServices;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200") 
@RestController
@RequestMapping("/eventos")
public class EventosController {

    @Autowired
    private EventosServices eventosServices;

    // GET: http://localhost:7575/eventos
    @GetMapping
    public List<EventosDTO> obtenerTodoslosEventos() {
        return eventosServices.obtenerTodos();
    }

    // POST: http://localhost:7575/eventos/crear
    @PostMapping("/crear")
    public String crear(@RequestBody EventosRequests request) {
        return eventosServices.crearEvento(request);
    }

    // PUT: http://localhost:7575/eventos/actualizar
    @PutMapping("/actualizar")
    public String actualizar(@RequestBody EventosActualizarRequests request) {
        return eventosServices.actualizarEvento(request);
    }

    // DELETE: http://localhost:7575/eventos/eliminar/{id}
    @DeleteMapping("/eliminar/{id}")
    public String eliminar(@PathVariable int id) {
        return eventosServices.eliminarEvento(id);
    }
}