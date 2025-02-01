/* tslint:disable */
/* eslint-disable */
/**
 * PokéAPI
 * All the Pokémon data you\'ll ever need in one place, easily accessible through a modern free open-source RESTful API.  ## What is this?  This is a full RESTful API linked to an extensive database detailing everything about the Pokémon main game series.  We\'ve covered everything from Pokémon to Berry Flavors.  ## Where do I start?  We have awesome [documentation](https://pokeapi.co/docs/v2) on how to use this API. It takes minutes to get started.  This API will always be publicly available and will never require any extensive setup process to consume.  Created by [**Paul Hallett**(]https://github.com/phalt) and other [**PokéAPI contributors***](https://github.com/PokeAPI/pokeapi#contributing) around the world. Pokémon and Pokémon character names are trademarks of Nintendo.     
 *
 * The version of the OpenAPI document: 2.7.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { PokemonDetailTypesInner } from './PokemonDetailTypesInner';
import {
    PokemonDetailTypesInnerFromJSON,
    PokemonDetailTypesInnerFromJSONTyped,
    PokemonDetailTypesInnerToJSON,
    PokemonDetailTypesInnerToJSONTyped,
} from './PokemonDetailTypesInner';
import type { AbilityDetailPokemonInnerPokemon } from './AbilityDetailPokemonInnerPokemon';
import {
    AbilityDetailPokemonInnerPokemonFromJSON,
    AbilityDetailPokemonInnerPokemonFromJSONTyped,
    AbilityDetailPokemonInnerPokemonToJSON,
    AbilityDetailPokemonInnerPokemonToJSONTyped,
} from './AbilityDetailPokemonInnerPokemon';

/**
 * 
 * @export
 * @interface PokemonDetailPastTypesInner
 */
export interface PokemonDetailPastTypesInner {
    /**
     * 
     * @type {AbilityDetailPokemonInnerPokemon}
     * @memberof PokemonDetailPastTypesInner
     */
    generation: AbilityDetailPokemonInnerPokemon;
    /**
     * 
     * @type {Array<PokemonDetailTypesInner>}
     * @memberof PokemonDetailPastTypesInner
     */
    types: Array<PokemonDetailTypesInner>;
}

/**
 * Check if a given object implements the PokemonDetailPastTypesInner interface.
 */
export function instanceOfPokemonDetailPastTypesInner(value: object): value is PokemonDetailPastTypesInner {
    if (!('generation' in value) || value['generation'] === undefined) return false;
    if (!('types' in value) || value['types'] === undefined) return false;
    return true;
}

export function PokemonDetailPastTypesInnerFromJSON(json: any): PokemonDetailPastTypesInner {
    return PokemonDetailPastTypesInnerFromJSONTyped(json, false);
}

export function PokemonDetailPastTypesInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): PokemonDetailPastTypesInner {
    if (json == null) {
        return json;
    }
    return {
        
        'generation': AbilityDetailPokemonInnerPokemonFromJSON(json['generation']),
        'types': ((json['types'] as Array<any>).map(PokemonDetailTypesInnerFromJSON)),
    };
}

export function PokemonDetailPastTypesInnerToJSON(json: any): PokemonDetailPastTypesInner {
    return PokemonDetailPastTypesInnerToJSONTyped(json, false);
}

export function PokemonDetailPastTypesInnerToJSONTyped(value?: PokemonDetailPastTypesInner | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'generation': AbilityDetailPokemonInnerPokemonToJSON(value['generation']),
        'types': ((value['types'] as Array<any>).map(PokemonDetailTypesInnerToJSON)),
    };
}

