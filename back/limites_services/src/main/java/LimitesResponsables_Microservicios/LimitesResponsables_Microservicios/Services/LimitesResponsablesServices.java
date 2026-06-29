package LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Services;

import LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Models.Entities.LimitesResponsables;
import LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Models.dto.LimitesResponsablesDTO;
import LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Models.requests.LimitesResponsablesActualizarRequests;
import LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Models.requests.LimitesResponsablesRequests;
import LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Repository.LimitesResponsablesRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LimitesResponsablesServices {

    @Autowired
    private LimitesResponsablesRepository repository;

    // Listar todos
    public List<LimitesResponsablesDTO> listarTodos() {
        return repository.findAll().stream().map(limite -> {
            LimitesResponsablesDTO dto = new LimitesResponsablesDTO();
            dto.setIdLimite(limite.getIdLimite());
            dto.setUsuariosIdUsuario(limite.getUsuariosIdUsuario());
            dto.setLimiteDiario(limite.getLimiteDiario());
            dto.setLimiteMensual(limite.getLimiteMensual());
            dto.setMontoApostadoDiario(limite.getMontoApostadoDiario());
            dto.setMontoApostadoMensual(limite.getMontoApostadoMensual());
            dto.setFechaActualizacion(limite.getFechaActualizacion());
            return dto;
        }).collect(Collectors.toList());
    }

    // Guardar nuevo
    public String guardarLimite(LimitesResponsablesRequests request) {
        LimitesResponsables limite = new LimitesResponsables();
        limite.setUsuariosIdUsuario(request.getUsuariosIdUsuario());
        limite.setLimiteDiario(request.getLimiteDiario());
        limite.setLimiteMensual(request.getLimiteMensual());
        limite.setMontoApostadoDiario(request.getMontoApostadoDiario());
        limite.setMontoApostadoMensual(request.getMontoApostadoMensual());
        limite.setFechaActualizacion(LocalDateTime.now()); // Hora actual automática
        repository.save(limite);
        return "Límite creado con éxito";
    }

    // Actualizar existente
    public String actualizarLimite(LimitesResponsablesActualizarRequests request) {
        Optional<LimitesResponsables> existente = repository.findById(request.getIdLimite());
        if (existente.isPresent()) {
            LimitesResponsables limite = existente.get();
            limite.setUsuariosIdUsuario(request.getUsuariosIdUsuario());
            limite.setLimiteDiario(request.getLimiteDiario());
            limite.setLimiteMensual(request.getLimiteMensual());
            limite.setMontoApostadoDiario(request.getMontoApostadoDiario());
            limite.setMontoApostadoMensual(request.getMontoApostadoMensual());
            limite.setFechaActualizacion(LocalDateTime.now()); // Se actualiza la estampa de tiempo
            repository.save(limite);
            return "Límite actualizado con éxito";
        }
        return "Error: Límite no encontrado";
    }

    // Eliminar
    public String eliminarLimite(int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return "Límite eliminado correctamente";
        }
        return "Error: Límite no encontrado";
    }
}