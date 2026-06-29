package LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Models.requests.BaseRequest;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/")
public class BaseController {
    @Value("${app.name}")
    private String nombreApp;

    @Value("${app.version}")
    private String versionApp;

    @GetMapping("")
    public BaseRequest baseController() {
        return new BaseRequest(nombreApp, versionApp);
    }
}

