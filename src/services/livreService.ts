// ── frontend/src/services/livreService.ts ───────────────────────
// Toutes les opérations sur les livres — encapsule les appels API

import type { ParamIdDto } from "@hendec/types/param";
import  {  paramIdSchema } from "@hendec/types/param";

import type { CreateLivreDto, FiltresLivreDto, UpdateLivreDto, LivreResponseDto } from "@hendec/types/minilib";
import {  livreResponseSchema, updateLivreSchema, livresResponseSchema } from "@hendec/types/minilib";

import { apiRequest } from "./api";

/**
* Récupère tous les livres avec filtres optionnels.
* @param filtres - genre, disponible, recherche
*/

export async function getLivres(
    filtres: FiltresLivreDto = {}
): Promise<LivreResponseDto[]> 
{
    // Construire les query params depuis les filtres non-undefined
    const params = new URLSearchParams();

    if (filtres.genre) 
        params.append("genre", filtres.genre);

    if (filtres.recherche) 
        params.append("recherche", filtres.recherche);

    if (filtres.disponible !== undefined)
        params.append("disponible", String(filtres.disponible));

    const query = params.toString() ? `?${params.toString()}` : "";

    return apiRequest<LivreResponseDto[]>(
        {
            schemaRespond: livresResponseSchema,
            endpoint: `/livres${query}`
        }
    );
}

/**
* Récupère un livre par son id.
*/
export async function getLivreById(
    paramGetbyId: ParamIdDto
): Promise<LivreResponseDto> 
{
       return apiRequest<LivreResponseDto>(
        {
            schemaParam: paramIdSchema,
            schemaRespond: livreResponseSchema,
            endpoint: `/livres/${paramGetbyId.id}`
        }
    );
}

/**
* Crée un nouveau livre.
*/
export async function creerLivre(
    data: CreateLivreDto
): Promise<LivreResponseDto> 
{
    return apiRequest<LivreResponseDto>(
        {
            schemaRespond: livreResponseSchema,
            endpoint: `/livres`,
            options:
            {
                method: "POST",
                body: JSON.stringify(data),
            }
        }
    );
}

/**
* Supprime un livre.
*/
export async function supprimerLivre(id: number): Promise<void> {
    return apiRequest<void>(
        {
            schemaParam: paramIdSchema,
            endpoint: `/livres/${id}`,
            options: { method: "DELETE" }
        }
    );

}

/**
 * update book
 */
export const updateLivre = async ( 
    paramUpdateLivre: ParamIdDto,
    data: UpdateLivreDto
): Promise<LivreResponseDto> => 
{

   return apiRequest<LivreResponseDto>(
        {
            schemaParam: paramIdSchema,
            schemaBody: updateLivreSchema,
            schemaRespond: livreResponseSchema,
            endpoint: `/livres/${paramUpdateLivre.id}`,
            options:
            {
                method: "PUT",
                body: JSON.stringify(data),
            }
        }
    );
};
