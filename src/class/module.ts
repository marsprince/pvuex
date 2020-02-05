// module manager
import { vuexOptions } from '../@types';
import { Store } from './store';

export default class Module {
  // rootModule
  public root: Module;
  // the moduleStore
  public store: Store;
  // childModule
  private _children: { string: Module };

  constructor(options: vuexOptions) {

  }
}
