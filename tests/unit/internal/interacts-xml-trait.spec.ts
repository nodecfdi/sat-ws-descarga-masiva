import { useTestCase } from '../../test-case';
import { InteractsXmlOverrideTraitSpecimen } from './interacts-xml-trait-override-specimen';
import { InteractsXmlTraitSpecimen } from './interacts-xml-trait.specimen';

describe('interacts xml trait', () => {
    const { fileContents } = useTestCase();

    test('find element expecting one', () => {
        const specimen = new InteractsXmlTraitSpecimen();
        const content = fileContents('verify/response-2-packages.xml', 'utf8');
        const root = specimen.readXmlElement(content);

        const search = [
            'body',
            'verificaSolicitudDescargaResponse',
            'verificaSolicitudDescargaResult',
        ];

        expect(specimen.findElements(root, ...search).length).toBe(1);
        expect(specimen.findElements(root, ...search)[0]).toStrictEqual(
            specimen.findElement(root, ...search)
        );
    });

    test('read xml document without content throws exception', () => {
        const specimen = new InteractsXmlTraitSpecimen();

        expect(() => specimen.readXmlDocument('')).toThrow(
            'Cannot load an xml with empty content'
        );
    });

    test('read xml element without document root element throws exception', () => {
        const specimen = new InteractsXmlOverrideTraitSpecimen();

        expect(() => specimen.readXmlElement('')).toThrow(
            'Cannot load an xml with empty content'
        );
    });

    test('find element expecting none', () => {
        const specimen = new InteractsXmlTraitSpecimen();
        const content = fileContents('verify/response-2-packages.xml', 'utf8');
        const root = specimen.readXmlElement(content);
        const search = ['body', 'foo', 'verificaSolicitudDescargaResult'];
        expect(specimen.findElements(root, ...search).length).toBe(0);
        expect(specimen.findElement(root, ...search)).toBeUndefined();
    });

    test('find element expecting two', () => {
        const specimen = new InteractsXmlTraitSpecimen();
        const content = fileContents('verify/response-2-packages.xml', 'utf8');
        const search = [
            'body',
            'verificaSolicitudDescargaResponse',
            'verificaSolicitudDescargaResult',
            'idsPaquetes',
        ];

        const root = specimen.readXmlElement(content);

        expect(specimen.findElements(root, ...search).length).toBe(2);
        expect(specimen.findElements(root, ...search)[0]).toStrictEqual(
            specimen.findElement(root, ...search)
        );
    });

    test('find content with known data', () => {
        const specimen = new InteractsXmlTraitSpecimen();
        const content = fileContents('verify/response-2-packages.xml', 'utf8');
        const search = [
            'body',
            'verificaSolicitudDescargaResponse',
            'verificaSolicitudDescargaResult',
            'idsPaquetes',
        ];
        const expectedContent = '4e80345d-917f-40bb-a98f-4a73939343c5_01';

        const root = specimen.readXmlElement(content);

        expect(specimen.findContent(root, ...search)).toBe(expectedContent);
    });

    test('find content with not found element', () => {
        const specimen = new InteractsXmlTraitSpecimen();
        const content = fileContents('verify/response-2-packages.xml', 'utf8');
        const search = [
            'body',
            'verificaSolicitudDescargaResponse',
            'FOO',
            'idsPaquetes',
        ];

        const root = specimen.readXmlElement(content);

        expect(specimen.findContent(root, ...search)).toBe('');
    });

    test('find contents', () => {
        const specimen = new InteractsXmlTraitSpecimen();
        const content = fileContents('verify/response-2-packages.xml', 'utf8');
        const search = [
            'body',
            'verificaSolicitudDescargaResponse',
            'verificaSolicitudDescargaResult',
            'idsPaquetes',
        ];
        const expectedContent = [
            '4e80345d-917f-40bb-a98f-4a73939343c5_01',
            '4e80345d-917f-40bb-a98f-4a73939343c5_02',
        ];

        const root = specimen.readXmlElement(content);

        expect(specimen.findContents(root, ...search)).toStrictEqual(
            expectedContent
        );
    });

    test('find attributes expecting results', () => {
        const specimen = new InteractsXmlTraitSpecimen();
        const content = fileContents('verify/response-2-packages.xml', 'utf8');
        const search = [
            'body',
            'verificaSolicitudDescargaResponse',
            'verificaSolicitudDescargaResult',
        ];
        const expectedContent = {
            codestatus: '5000',
            estadosolicitud: '3',
            codigoestadosolicitud: '5000',
            numerocfdis: '12345',
            mensaje: 'Solicitud Aceptada',
        };

        const root = specimen.readXmlElement(content);

        expect(specimen.findAtrributes(root, ...search)).toStrictEqual(
            expectedContent
        );
    });

    test('find attributes on non existing node', () => {
        const specimen = new InteractsXmlTraitSpecimen();
        const content = fileContents('verify/response-2-packages.xml', 'utf8');
        const search = ['body', 'FOO', 'verificaSolicitudDescargaResult'];

        const root = specimen.readXmlElement(content);

        expect(specimen.findAtrributes(root, ...search)).toStrictEqual({});
    });
});
