import { IContext } from '../interface/type';
export declare function GlobalVesion(ctx: IContext, next: Function): Promise<void>;
/**
 *
 *
 * @export
 * @param {*} ctx
 * @param {*} next
 */
export declare function GlobalCheckCommand(ctx: IContext, next: Function): Promise<void>;
export declare function GlobEmptyArgv(ctx: IContext, next: Function): Promise<void>;
declare const _default: (typeof GlobEmptyArgv)[];
export default _default;
