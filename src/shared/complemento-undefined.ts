import { ComplementoInterface } from './complemento-interface';
import { BaseEnum } from './enum/base-enum';

type ComplementoUndefinedTypes = 'undefined';

export class ComplementoUndefined
    extends BaseEnum<ComplementoUndefinedTypes>
    implements ComplementoInterface<ComplementoUndefinedTypes>
{
    private readonly Map = {
        undefined: {
            satCode: '',
            label: 'Sin complemento definido'
        }
    };

    public static create(id: ComplementoUndefinedTypes): ComplementoInterface<ComplementoUndefinedTypes> {
        return new ComplementoUndefined(id);
    }

    public static undefined(): ComplementoInterface<ComplementoUndefinedTypes> {
        return new ComplementoUndefined('undefined');
    }

    public label(): string {
        return this.Map[this._id].label;
    }

    public value(): string {
        return this.Map[this._id].satCode;
    }

    public override toJSON(): string {
        return this.value();
    }
}
