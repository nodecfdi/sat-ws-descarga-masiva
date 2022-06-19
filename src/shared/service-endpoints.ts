/**
 * This class contains the end points to consume the service
 * Use ServiceEndpoints.cfdi() for "CFDI regulares"
 * Use ServiceEndpoints.retenciones() for "CFDI de retenciones e información de pagos"
 *
 * @see ServiceEndpoints::cfdi()
 * @see ServiceEndpoints::retenciones()
 */
export class ServiceEndpoints {
    private _authenticate: string;

    private _query: string;

    private _verify: string;

    private _download: string;

    constructor(authenticate: string, query: string, verify: string, download: string) {
        this._authenticate = authenticate;
        this._query = query;
        this._verify = verify;
        this._download = download;
    }

    /**
     * Create an object with known endpoints for "CFDI regulares"
     */
    public static cfdi(): ServiceEndpoints {
        return new ServiceEndpoints(
            'https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/Autenticacion/Autenticacion.svc',
            'https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/SolicitaDescargaService.svc',
            'https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/VerificaSolicitudDescargaService.svc',
            'https://cfdidescargamasiva.clouda.sat.gob.mx/DescargaMasivaService.svc'
        );
    }

    public static retenciones(): ServiceEndpoints {
        return new ServiceEndpoints(
            'https://retendescargamasivasolicitud.clouda.sat.gob.mx/Autenticacion/Autenticacion.svc',
            'https://retendescargamasivasolicitud.clouda.sat.gob.mx/SolicitaDescargaService.svc',
            'https://retendescargamasivasolicitud.clouda.sat.gob.mx/VerificaSolicitudDescargaService.svc',
            'https://retendescargamasiva.clouda.sat.gob.mx/DescargaMasivaService.svc'
        );
    }

    public getAuthenticate(): string {
        return this._authenticate;
    }

    public getQuery(): string {
        return this._query;
    }

    public getVerify(): string {
        return this._verify;
    }

    public getDownload(): string {
        return this._download;
    }
}
