import type { ZodType } from  "zod";

export interface ApiRequestParam<TResponse, TBody = unknown, TParams = unknown, TQuery = unknown> {
    endpoint: string;
    schemaRespond?: ZodType<TResponse>;
    schemaParam?: ZodType<TParams>;
    schemaBody?: ZodType<TBody>;
    schemaQuery?: ZodType<TQuery>;
    options?: RequestInit;
}


export interface ApiError 
{
    erreur: string;
    champs?: string[];
}
