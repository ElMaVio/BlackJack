package LimitesResponsables_Microservicios.LimitesResponsables_Microservicios.Models.requests;

public class BaseRequest {
    private String nombreApp;
    private String versionApp;

    public BaseRequest(String nombreApp, String versionApp) {
        this.nombreApp = nombreApp;
        this.versionApp = versionApp;
    }

    public String getNombreApp() {
        return nombreApp;
    }

    public void setNombreApp(String nombreApp) {
        this.nombreApp = nombreApp;
    }

    public String getVersionApp() {
        return versionApp;
    }

    public void setVersionApp(String versionApp) {
        this.versionApp = versionApp;
    }
}

