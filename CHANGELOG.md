# @nodecfdi/sat-ws-descarga-masiva ChangeLog

## 1.0.1

### Fix missing types

- added missing types in bundle generation

## 1.0.0

### Drop @nodecfdi/cfdiutils-common dependency

- update base dependencies.
- drop `@nodecfdi/cfdiutils-common` dependency.
- install from DOMParser, XMLSerializer, DOMImplementation now is made internally by the library.
- fix for metadata download when some fields are not present.

## 0.1.4

### Sonar lint errors and fix docs generation

- fix: sonar lint errors and fix docs generation

## 0.1.3

### update dependencies and lint errors

- update dependencies `@nodecfdi/cfdiutils-common`, `@nodecfdi/credentials`, `@nodecfdi/rfc`, etc.
- more stricts lint check
- add `esm` module support

## 0.1.2

### Remove `@internal`

- se remueve `@internal` de los módulos internos para permitir que se exporten de manera correcta.

## 0.1.1

### Patch Changes

- se agregan types para TS faltantes.
- se actualiza la documentación donde se decía que la lib requiere axios, pero esta dependencia no es usada.

## 0.1.0

### First release version

- Primera version de descarga masiva con los filtros actualizados de acuerdo a la versión del servicio actual del SAT.
