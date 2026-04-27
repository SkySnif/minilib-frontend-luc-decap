import { ZodType } from "zod";

export function validate<T> (
    schema: ZodType<T>,
    data: unknown
): T
{
    const result = schema.safeParse(data);

    if (!result.success) 
        throw new Error("[MIDDLEWARE] Validation failed");
//            throw new BadRequestError("Validation failed", result.error.issues);

    return result.data;
}
