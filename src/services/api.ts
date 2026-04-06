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
export interface ApiError 
{
    erreur: string;
    champs?: string[];
}

/**
* Effectue une requête HTTP vers l'API MiniLib.
* Lance une erreur si la réponse n'est pas OK (status >= 400).
*
* @param endpoint - Chemin relatif ex: "/livres" ou "/livres/1"
* @param options - Options fetch standard (method, body, headers)
* @returns - La réponse parsée en JSON typée T
*/
export async function apiRequest<T>(endpoint: string, options?: RequestInit):
    Promise<T> 
{
    const response = await fetch(`${BASE_URL}${endpoint}`, 
        {
            headers: { "Content-Type": "application/json", ...options?.headers },
            ...options,
        }
    );

    if (!response.ok) 
    {
        const erreur: ApiError = await response.json().catch(() => (
                {
                erreur: `Erreur HTTP ${response.status}`,
                }
            )
        );
        throw new Error(erreur.erreur);
    }
    
    // 204 No Content — pas de corps à parser (DELETE)
    if (response.status === 204) return undefined as T;
    
    return response.json() as Promise<T>;
}
