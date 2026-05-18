package LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Controller;

import LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Models.dto.LimitesResponsablesDTO;
import LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Models.requests.LimitesResponsablesActualizarRequests;
import LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Models.requests.LimitesResponsablesRequests;
import LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Services.LimitesResponsablesServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RestController
@RequestMapping("/limites")
public class LimitesResponsablesController {

    @Autowired
    private LimitesResponsablesServices services;

    // 1. Obtener todos los límites (Para listarlos en una tabla)
    @GetMapping("")
    public List<LimitesResponsablesDTO> obtenerTodos() {
        return services.listarTodos();
    }

    // 2. Crear un nuevo registro de límite
    @PostMapping("")
    public String crear(@RequestBody LimitesResponsablesRequests request) {
        return services.guardarLimite(request);
    }

    // 3. Modificar un límite existente
    @PutMapping("")
    public String editar(@RequestBody LimitesResponsablesActualizarRequests request) {
        return services.actualizarLimite(request);
    }

    // 4. Eliminar un límite mediante su ID de la tabla
    @DeleteMapping("/{id}")
    public String eliminar(@PathVariable int id) {
        return services.eliminarLimite(id);
    }
}