// ── frontend/src/services/adherentService.ts ───────────────────────
// Toutes les opérations sur les adherents — encapsule les appels API
import { adherentResponseSchema, createAdherentSchema } from "@hendec/types/minilib";
import type { CreateAdherentDto, FilterAdherentDto, UpdateAdherentDto, DeleteAdherentDto, AdherentResponseDto} from "@hendec/types/minilib";
import { apiRequest } from "./api";


const g_routeDirMember="adherents"
/**
* Récupère tous les adherents avec filtres optionnels.
* @param filtres - genre, disponible, recherche
*/

export async function getAdherents(
    p_filtres: FilterAdherentDto = {}
): Promise<AdherentResponseDto[]> 
{
    // Construire les query params depuis les filtres non-undefined
    const params = new URLSearchParams();

    Object.entries(p_filtres).forEach(([v_ParamName, v_ParamValue]) => 
    {
        if (v_ParamValue !== undefined && v_ParamValue !== "") {
        params.append(v_ParamName, String(v_ParamValue));
        }
    });

    const query = params.toString() ? `?${params.toString()}` : "";

    return apiRequest<AdherentResponseDto[]>(`${g_routeDirMember}${query}`);
}

/**
* Récupère un adherent par son id.
*/
export async function getAdherentById(
    id: number
): Promise<AdherentResponseDto> 
{
    return apiRequest<AdherentResponseDto>(`${g_routeDirMember}/${id}`);
}

/**
* Create a member
*/
export async function creerAdherents(
    data: CreateAdherentDto
): Promise<AdherentResponseDto> 
{
    return apiRequest<AdherentResponseDto>(`${g_routeDirMember}`, adherentResponseSchema, 
        {
            method: "POST",
            body: JSON.stringify(data),
        }
    );
}

/**
* Delete a member
*/
export async function supprimerAdherent
(
    p_data: DeleteAdherentDto
): Promise<void> {
    return apiRequest<void>(`${g_routeDirMember}/${p_data.id}`, 
        undefined,
        { 
            method: "DELETE" 
        }
    );
}


/**
* Update a member
* id is not a part of the update message as it cannot be updated
*/
export const updateAdherent = async ( 
    p_id: number,
    p_data: UpdateAdherentDto
): Promise<AdherentResponseDto | null> => 
{
    
    return apiRequest<AdherentResponseDto>(`${g_routeDirMember}/${p_id}`, 
        adherentResponseSchema,
        {
            method: "PUT",
            body: JSON.stringify(p_data),
        }
    );
};