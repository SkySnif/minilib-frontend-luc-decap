import type { ZodSafeParseResult } from  "zod";

import type { ApiRequestParam, ApiError } from "../types/api";

// ── frontend/src/services/api.ts ────────────────────────────────
// Point d'entrée unique pour tous les appels HTTP
// Centralise l'URL de base et les headers communs
// L'URL de base vient d'une variable d'environnement Vite
// Vite expose les variables préfixées VITE_ via import.meta.env

// TODO: change import.meta.env.VITE_API_URL variable/path and remove efault harcoded value from global services, manage erreur not defined instead
// TODO2: Check ping or something and logging way in console or other. issue URL : htpp missing in BASE_URL error : raised :
// Erreur : JSON.parse: unexpected character at line 1 column 1 of the JSON data 
// Vérifiez que le backend tourne sur 192.168.100.10:5001/api/v1
const BASE_URL = `http://${import.meta.env.VITE_API_MINILIB_HOST}:${import.meta.env.VITE_API_MINILIB_PORT}${import.meta.env.VITE_API_MINILIB_ROUTE}`

// Type générique pour uniformiser les réponses

/**
* Effectue une requête HTTP vers l'API MiniLib.
* Lance une erreur si la réponse n'est pas OK (status >= 400).
*/
export async function apiRequest<TResponse, TBody = unknown, TParams = unknown, TQuery = unknown>(
    apiRequestParam: ApiRequestParam<TResponse, TBody, TParams, TQuery>
): Promise<TResponse> 
{
    const { endpoint, schemaParam, schemaRespond, schemaBody, options } = apiRequestParam;
    let json: any;

    const response: Response = await fetch(`${BASE_URL}${endpoint}`, 
    //const response = await fetch(`${url}`, 
        {
            headers: 
            { 
                "Content-Type": "application/json",
                ...options?.headers 
            },
            ...options,
        }
    );

    try 
    {
        // Try read Json message ( can be message info type but it'll be with response status not equal 200-299)
        json = await response.json();
    } 
    catch
    {
        json = null;
    }

    if (!response.ok)
    {
        if ( json )
        {
            throw new Error(`Erreur JSON : ${json.message}`);
        }
        else
        {
            throw new Error(json?.erreur ?? `Erreur HTTP ${response.status}`);
        }
    }

    // 204 No Content — pas de corps à parser (DELETE)
    if (response.status === 204) 
        return undefined as TResponse;

    // Validation with type before return
    if ( schemaRespond )
    {
        const parsed: ZodSafeParseResult<TResponse> = schemaRespond.safeParse(json); 

        if (!parsed.success) 
            throw new Error(`JSON return from ${BASE_URL}${endpoint} invalide : ${parsed.error.message}`);
    
        return parsed.data;
  }

  return json as TResponse;
}
