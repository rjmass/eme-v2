import { BaseComponent } from 'components/Base';
import { tabs, dirtycheck, dialogs } from 'decorators';

@tabs()
@dialogs()
@dirtycheck()
export default class TemplateBase extends BaseComponent { }
