# @nodecfdi/sat-ws-descarga-masiva

[![Source Code][badge-source]][source]
[![Software License][badge-license]][license]
[![Latest Version][badge-release]][release]
[![Discord][badge-discord]][discord]

[source]: https://github.com/nodecfdi/sat-ws-descarga-masiva
[badge-source]: https://img.shields.io/badge/source-nodecfdi%2Fsat--ws--descarga--masiva-blue?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMTIgMTIgNDAgNDAiPjxwYXRoIGZpbGw9IiMzMzMzMzMiIGQ9Ik0zMiwxMy40Yy0xMC41LDAtMTksOC41LTE5LDE5YzAsOC40LDUuNSwxNS41LDEzLDE4YzEsMC4yLDEuMy0wLjQsMS4zLTAuOWMwLTAuNSwwLTEuNywwLTMuMiBjLTUuMywxLjEtNi40LTIuNi02LjQtMi42QzIwLDQxLjYsMTguOCw0MSwxOC44LDQxYy0xLjctMS4yLDAuMS0xLjEsMC4xLTEuMWMxLjksMC4xLDIuOSwyLDIuOSwyYzEuNywyLjksNC41LDIuMSw1LjUsMS42IGMwLjItMS4yLDAuNy0yLjEsMS4yLTIuNmMtNC4yLTAuNS04LjctMi4xLTguNy05LjRjMC0yLjEsMC43LTMuNywyLTUuMWMtMC4yLTAuNS0wLjgtMi40LDAuMi01YzAsMCwxLjYtMC41LDUuMiwyIGMxLjUtMC40LDMuMS0wLjcsNC44LTAuN2MxLjYsMCwzLjMsMC4yLDQuNywwLjdjMy42LTIuNCw1LjItMiw1LjItMmMxLDIuNiwwLjQsNC42LDAuMiw1YzEuMiwxLjMsMiwzLDIsNS4xYzAsNy4zLTQuNSw4LjktOC43LDkuNCBjMC43LDAuNiwxLjMsMS43LDEuMywzLjVjMCwyLjYsMCw0LjYsMCw1LjJjMCwwLjUsMC40LDEuMSwxLjMsMC45YzcuNS0yLjYsMTMtOS43LDEzLTE4LjFDNTEsMjEuOSw0Mi41LDEzLjQsMzIsMTMuNHoiLz48L3N2Zz4%3D
[license]: https://github.com/nodecfdi/sat-ws-descarga-masiva/blob/main/LICENSE
[badge-license]: https://img.shields.io/github/license/nodecfdi/sat-ws-descarga-masiva?logo=open-source-initiative&style=flat-square
[badge-release]: https://img.shields.io/npm/v/@nodecfdi/sat-ws-descarga-masiva
[release]: https://www.npmjs.com/package/@nodecfdi/sat-ws-descarga-masiva
[badge-discord]: https://img.shields.io/discord/459860554090283019?logo=discord&style=flat-square
[discord]: https://discord.gg/aFGYXvX

> Librería para usar el servicio web del SAT de Descarga Masiva

:us: The documentation of this project is in spanish as this is the natural language for intended audience.

:mexico: La documentación del proyecto está en español porque ese es el lenguaje principal de los usuarios.

# Instalación

```shell
npm i @nodecfdi/sat-ws-descarga-masiva --save
```

o

```shell
yarn add @nodecfdi/sat-ws-descarga-masiva
```

# Uso básico

## Creación del servicio

```ts
import { readFileSync } from 'fs';
import { Fiel, AxiosWebClient, FielRequestBuilder, Service } from '@nodecfdi/sat-ws-descarga-masiva';
// Creación de la FIEL, puede leer archivos DER (como los envía el SAT) o PEM (convertidos con openssl)
const fiel = Fiel.create(
    readFileSync('fake-fiel/EKU9003173C9.cer', 'binary'),
    readFileSync('fake-fiel/EKU9003173C9.key', 'binary'),
    '12345678a'
);
// verificar que la FIEL sea válida (no sea CSD y sea vigente acorde a la fecha del sistema)
if (!fiel.isValid()) {
    return;
}

// creación del web client basado en Axios que implementa WebClientInterface
// para usarlo necesitas instalar axios pues no es una dependencia directa
const webClient = new AxiosWebClient();

// creación del objeto encargado de crear las solicitudes firmadas usando una FIEL
const requestBuilder = new FielRequestBuilder(fiel);

// Creación del servicio
const service = new Service(requestBuilder, webClient);
```

# Cliente para consumir los servicios de CFDI de Retenciones

Existen dos tipos de Comprobantes Fiscales Digitales, los regulares (ingresos, egresos, traslados, nóminas y pagos), y los CFDI de retenciones e información de pagos (retenciones).

Puede utilizar esta librería para consumir los CFDI de Retenciones. Para lograrlo construya el servicio con la especificación de `ServiceEndpoints.retenciones()`

```ts
import { AxiosWebClient, RequestBuilderInterface, ServiceEndpoints } from '@nodecfdi/sat-ws-descarga-masiva';
/**
 * @var webClient: AxiosWebClient
 * @var requestBuilder: RequestBuilderInterface
 */
// Creación del servicio
const service = new Service(requestBuilder, webClient, undefined, ServiceEndpoints.retenciones());
```

# Realiza una consulta

Una vez creado el servicio, se puede presentar la consulta que tiene estos cuatro parámetros:

-   Periodo: Fecha y hora de inicio y fin de la consulta.
-   Tipo de descarga: CFDI emitidos `DownloadType.issued` o recibidos `DownloadType.received`.
-   Tipo de solicitud: De metadatos `RequestType.metadata` o de archivos CFDI `RequestType.cfdi`.
-   Filtrado por RFC: Si se establece, se filtran para obtener únicamente donde la contraparte tenga el RFC indicado.

```ts
import { QueryParameters, DownloadType, RequestType, DateTimePeriod } from '@nodecfdi/sat-ws-descarga-masiva';
/**
 * El servicio ya existe
 * @var service: Service
 */

// Explicación de la consulta:
// - Del 13/ene/2019 00:00:00 al 13/ene/2019 23:59:59 (inclusive)
// - Todos los emitidos por el dueño de la FIEL
// - Solicitando la información de Metadata
// - Filtrando los CFDI emitidos para RFC MAG041126GT8
const request = QueryParameters.create(
    DateTimePeriod.createFromValues('2022-01-01 00:00:00', '2022-02-28 23:59:59'),
    DownloadType.issued,
    RequestType.metadata,
    'MAG041126GT8'
);
// presentar la consulta
const query = await service.query(request);
if (!query.getStatus().isAccepted()) {
    console.log(`Fallo al presentar la consulta: ${query.getStatus().getMessage()}`);
    return;
}
console.log(`Se generó la solicitud ${query.getRequestId()}`);
```

# Consulta con valores predeterminados

Valores predeterminados de una consulta:

-   Consultar comprobantes emitidos `DownloadType.issued`.
-   Solicitar información de metadata `RequestType.metadata`.
-   Sin filtro de RFC.

```ts
import { QueryParameters, DateTimePeriod } from '@nodecfdi/sat-ws-descarga-masiva';
// Consulta del día 2019-01-13, solo los emitidos, información de tipo metadata, sin filtro de RFC.
const request = QueryParameters.create(DateTimePeriod.createFromValues('2019-01-13 00:00:00', '2019-01-13 23:59:59'));
```

# Verificar una consulta

La verificación depende de que la consulta haya sido aceptada.

```ts
import { Service } from '@nodecfdi/sat-ws-descarga-masiva';
/**
 * @var service: Service
 * @var requestId: string es el identificador generado al presentar la consulta
 */
// consultar el servicio de verificación
const verify = await service.verify(requestId);

// revisar que el proceso de verificación fue correcto
if (!verify.getStatus().isAccepted()) {
    console.log(`Fallo al verificar la consulta ${requestId}: ${verify.getStatus().getMessage()}`);
    return;
}

// revisar que la consulta no haya sido rechazada: los valores conocidos son: Accepted, Exhausted, MaximumLimitReaded, EmptyResult, Duplicated
if (verify.getCodeRequest().getEntryId() != 'Accepted') {
    console.log(`La solicitud ${requestId} fue rechazada: ${verify.getCodeRequest().getMessage()}`);
    return;
}

// revisar el progreso de la generación de los paquetes los valores conocidos son: Accepted, InProgress, Finished, Failure, Rejected, Expired
const statusRequest = verify.getStatusRequest();
if (
    statusRequest.getEntryId() == 'Expired' ||
    statusRequest.getEntryId() == 'Failure' ||
    statusRequest.getEntryId() == 'Rejected'
) {
    console.log(`La solicitud ${requestId} no se puede completar`);
    return;
}

if (statusRequest.getEntryId() == 'Accepted' || statusRequest.getEntryId() == 'InProgress') {
    console.log(`La solicitud ${requestId} se está procesando`);
    return;
}

if (statusRequest.getEntryId() == 'Finished') {
    console.log(`La solicitud ${requestId} está lista`);
}

console.log(`se encontraron ${verify.countPackages()} paquetes`);
verify.getPackageIds().forEach((packageId) => {
    console.log(packageId);
});
```

# Descarga los paquetes de la consulta

La descarga de los paquetes depende de que la consulta haya sido correctamente verificada.

Una consulta genera un identificador de la solicitud, la verificación retorna uno o varios identificadores de paquetes. Necesitas descargar todos y cada uno de los paquetes para tener la información completa de la consulta.

```ts
import { Service } from '@nodecfdi/sat-ws-descarga-masiva';
import { writeFileSync } from 'fs';
/**
 * @var service: Service
 * @var packagesIds: string[] El listado de identificadores de paquetes generado en la (correcta) verificación
 */
for (const packageId of packagesIds) {
    const download = await service.download(packageId);
    if (!download.getStatus().isAccepted()) {
        console.log(`El paquete ${packageId} no se ha podido descargar: ${download.getStatus().getMessage()}`);
        continue;
    }
    const filezip = 'package.zip';
    writeFileSync(filezip, download.getPackageContent(), { encoding: 'binary' });
    console.log(`el paquete ${packageId} se ha almacenado`);
}
```

# Lectura de paquetes

Los paquetes de Metadata y CFDI se pueden leer con las clases MetadataPackageReader y CfdiPackageReader respectivamente. Para fabricar los objetos, se pueden usar sus métodos createFromFile para crearlo a partir de un archivo existente o createFromContents para crearlo a partir del contenido del archivo en memoria.

Cada paquete puede contener uno o más archivos internos. Cada paquete se lee individualmente.

## Lectura de paquetes de tipo Metadata

```ts
import { MetadataPackageReader, OpenZipFileException, Helpers } from '@nodecfdi/sat-ws-descarga-masiva';
/**
 * @var zipfile: string contiene la ruta al archivo de paquete de Metadata
 */
let metadataReader: MetadataPackageReader;
// abrir el archivo de Metadata
try {
    metadataReader = await MetadataPackageReader.createFromFile(zipFile);
} catch (error) {
    const zipError = error as OpenZipFileException;
    console.log(zipError.message);
    return;
}
const metadata = await Helpers.iteratorToMap(metadataReader.metadata());
metadata.forEach((data) => {
    console.log(`${data.get('uuid')} : ${data.get('fechaEmision')}`);
});
```

## Lectura de paquetes de tipo CFDI

```ts
import { CfdiPackageReader, OpenZipFileException } from '@nodecfdi/sat-ws-descarga-masiva';
import { writeFileSync } from 'fs';
/**
 * @var zipfile: string contiene la ruta al archivo de paquete de archivos ZIP
 */

let cfdiReader: CfdiPackageReader;
try {
    cfdiReader = await CfdiPackageReader.createFromFile(zipFile);
} catch (error) {
    const zipError = error as OpenZipFileException;
    console.log(zipError.message);
    return;
}

const cfdis = cfdiReader.cfdis();
for await (const cfdi of cfdis) {
    writeFileSync(`cfdis/${Object.keys(cfdi)[0]}`, Object.values(cfdi)[0]);
}
```

# Información técnica

La información técnica puede ser leida del siguiente link: [CfdiPackageReader](https://github.com/phpcfdi/sat-ws-descarga-masiva#informaci%C3%B3n-t%C3%A9cnica) facilitada por la librería que inspiró a ésta.

# Copyright and License
The `nodecfdi/sat-ws-descarga-masiva` library is copyright © NodeCfdi and [OcelotlStudio](https://ocelotlstudio.com)
and licensed for use under the MIT License (MIT). Please see [LICENSE][] for more information.
