import { Context } from "./context";
import { MiddlewareTransforms } from "./transforms/middleware";
import { TAnnotationScanerMethod } from "../annotation";
import { ExceptionConsumer } from "./transforms/expception";
export async function ContextTransforming<T extends object = {}>(ctx: Context<T>, method: TAnnotationScanerMethod) {
  const middlewareConsumer = new MiddlewareTransforms();
  return await middlewareConsumer.compose(ctx, method).then(() => ctx.status = 200)
    .catch(async (e?: Error) => {
      if (ctx.status !== 900) {
        ctx.status = 500;
        const consumer = new ExceptionConsumer();
        const result = await consumer.catch(e, method, ctx);
        if (result) return ctx.app.trigger('Application.onErrorRender', result);
      }
    });
}