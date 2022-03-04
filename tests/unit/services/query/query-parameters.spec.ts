import { DateTime } from '../../../../src/shared/date-time';
import { DateTimePeriod } from '../../../../src/shared/date-time-period';
import { DownloadType } from '../../../../src/shared/download-type';
import { RequestType } from '../../../../src/shared/request-type';
import { QueryParameters } from '../../../../src/services/query/query-parameters';
import { TestCase } from '../../../test-case';

describe('query parameters', () => {
    test('all properties', () => {
        const period = DateTimePeriod.create(DateTime.create('2019-01-01 00:00:00'), DateTime.create('2019-01-01 00:04:00'));
        const downloadType = DownloadType.received;
        const requestType = RequestType.cfdi;
        const rfcMatch = 'AAA010101AAA';

        const query = QueryParameters.create(period, downloadType, requestType, rfcMatch);

        expect(query.getPeriod()).toBe(period);
        expect(query.getDownloadType()).toBe(downloadType);
        expect(query.getRequestType()).toBe(requestType);
        expect(query.getRfcMatch()).toBe(rfcMatch);
    });

    test('minimal create', () => {
        const period = DateTimePeriod.create(DateTime.create('2019-01-01 00:00:00'), DateTime.create('2019-01-01 00:04:00'));

        const query = QueryParameters.create(period);

        expect(query.getRequestType() == RequestType.metadata).toBeTruthy();
        expect(query.getDownloadType() == DownloadType.issued).toBeTruthy();
        expect(query.getRfcMatch()).toBe('');
    });

    test('json', () => {
        const period = DateTimePeriod.createFromValues('2019-01-01T00:00:00-06:00', '2019-01-01T00:04:00-06:00');
        const downloadType = DownloadType.received;
        const requestType = RequestType.cfdi;
        const rfcMatch = 'AAAA010101AAA';

        const query = QueryParameters.create(period, downloadType, requestType, rfcMatch);

        const expectedFile = TestCase.fileContents('json/query-parameters.json');

        expect(JSON.stringify(query.jsonSerialize())).toBe(JSON.stringify(JSON.parse(expectedFile)));
    });
});

